import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';

export const dashboardService = {
  getStats: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const q = query(collection(db, 'samples'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    
    let totalSamples = 0;
    let particlesDetected = 0;
    let totalSeverity = 0;
    let recentUploads = 0;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalSamples += 1;
      particlesDetected += data.particleCount || 0;
      totalSeverity += data.severity || 0;
      
      if (new Date(data.createdAt) >= firstDayOfMonth) {
        recentUploads += 1;
      }
    });

    const avgSeverity = totalSamples > 0 ? Math.round(totalSeverity / totalSamples) : 0;

    return {
      totalSamples,
      particlesDetected,
      avgSeverity,
      recentUploads,
    };
  },

  getPollutionTrends: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const q = query(collection(db, 'samples'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Build ordered month slots for the last 6 months using YYYY-MM keys
    const slots = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      slots[key] = { label: monthNames[d.getMonth()], scoreTotal: 0, count: 0 };
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Prefer createdAt (ISO string); fall back to date (YYYY-MM-DD)
      const raw = data.createdAt || (data.date ? data.date + 'T12:00:00' : null);
      if (!raw) return;
      const d = new Date(raw);
      if (isNaN(d) || d < sixMonthsAgo) return;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (slots[key]) {
        slots[key].scoreTotal += data.severity || 0;
        slots[key].count += 1;
      }
    });

    return Object.values(slots).map(slot => ({
      date: slot.label,
      score: slot.count > 0 ? Math.round(slot.scoreTotal / slot.count) : 0,
    }));
  },

  getRecentActivity: async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(collection(db, 'samples'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    
    // Sort in JS to avoid Firestore composite index requirement
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return docs.slice(0, 5).map(data => {
      const date = new Date(data.createdAt);
      const now = new Date();
      const diffMs = now - date;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHrs / 24);
      
      let timeStr = 'Just now';
      if (diffDays > 0) timeStr = `${diffDays} days ago`;
      else if (diffHrs > 0) timeStr = `${diffHrs} hours ago`;

      return {
        id: data.id,
        action: 'Sample analyzed',
        detail: data.location || data.fileName,
        time: timeStr,
        severity: data.severity
      };
    });
  },

  getParticleBreakdown: async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(collection(db, 'samples'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    
    let fibers = 0, films = 0, fragments = 0, pallets = 0;

    snapshot.forEach((doc) => {
      const p = doc.data().particles;
      if (p) {
        fibers    += p.fibers    || 0;
        films     += p.films     || 0;
        fragments += p.fragments || 0;
        // sampleService saves as 'pallets'; older records may use 'spheres'
        pallets   += p.pallets ?? p.spheres ?? 0;
      }
    });

    return [
      { name: 'Fibers',    count: fibers },
      { name: 'Films',     count: films },
      { name: 'Fragments', count: fragments },
      { name: 'Pallets',   count: pallets },
    ];
  },
};
