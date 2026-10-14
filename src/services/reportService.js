import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export const reportService = {
  getReports: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const q = query(
      collection(db, 'reports'), 
      where('userId', '==', user.uid)
    );
    
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort in JS to avoid Firestore composite index requirement
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return docs;
  },

  generateReport: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    // Fetch all samples to aggregate real data
    const q = query(collection(db, 'samples'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);

    let totalSamples = 0;
    let totalSeverity = 0;
    let earliestDate = null;
    let latestDate = null;

    snapshot.forEach(doc => {
      const data = doc.data();
      totalSamples++;
      totalSeverity += data.severity || 0;

      const d = new Date(data.createdAt || data.date);
      if (!isNaN(d)) {
        if (!earliestDate || d < earliestDate) earliestDate = d;
        if (!latestDate   || d > latestDate)   latestDate   = d;
      }
    });

    const avgSeverity = totalSamples > 0 ? Math.round(totalSeverity / totalSamples) : 0;

    // Build a meaningful date range string from real data
    const fmt = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const dateRange = earliestDate && latestDate
      ? (earliestDate.toDateString() === latestDate.toDateString()
          ? fmt(earliestDate)
          : `${fmt(earliestDate)} – ${fmt(latestDate)}`)
      : 'No samples yet';

    const now = new Date();
    const reportData = {
      userId: user.uid,
      title: `Analysis Report — ${fmt(now)}`,
      dateRange,
      totalSamples,
      avgSeverity,
      status: 'completed',
      createdAt: now.toISOString(),
    };

    const docRef = await addDoc(collection(db, 'reports'), reportData);
    return { id: docRef.id, ...reportData };
  },
};
