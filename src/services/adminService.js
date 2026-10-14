import { 
  collection, getDocs, query, where, deleteDoc, doc, orderBy 
} from 'firebase/firestore';
import { db, auth } from './firebase';

export const adminService = {
  getAllUsers: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    const q = query(collection(db, 'users'));
    try {
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return docs;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to load users. Please check your permissions.');
    }
  },

  deleteUser: async (userId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    // Delete user doc from Firestore
    await deleteDoc(doc(db, 'users', userId));

    // Also delete their samples and reports for a clean removal
    const samplesSnap = await getDocs(
      query(collection(db, 'samples'), where('userId', '==', userId))
    );
    const reportsSnap = await getDocs(
      query(collection(db, 'reports'), where('userId', '==', userId))
    );

    const deletions = [
      ...samplesSnap.docs.map(d => deleteDoc(d.ref)),
      ...reportsSnap.docs.map(d => deleteDoc(d.ref)),
    ];
    await Promise.all(deletions);
  },

  getUserReports: async (userId) => {
    const q = query(
      collection(db, 'reports'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return docs;
  },

  getUserActivity: async (userId) => {
    // Activity = all samples/analyses run by this user
    const q = query(
      collection(db, 'samples'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return docs;
  },
};
