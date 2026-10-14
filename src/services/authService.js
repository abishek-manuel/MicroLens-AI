import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const authService = {
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  register: async (name, email, password) => {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Professional Standard: Assign role based on specific email at registration
    const role = email.toLowerCase() === 'abbishek245@gmail.com' ? 'admin' : 'researcher';

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    });

    return user;
  },

  logout: async () => {
    await firebaseSignOut(auth);
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  getCurrentUser: async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        ...userDoc.data()
      };
    }
    return null;
  }
};
