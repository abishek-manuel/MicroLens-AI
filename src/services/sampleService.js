import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from './firebase';

// Use the Vite proxy (/api/*) so CORS is avoided in dev.
// In production, set VITE_API_URL to your deployed backend URL.
const ML_API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/predict`
  : '/api/predict';

export const sampleService = {
  getSamples: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const q = query(
      collection(db, 'samples'), 
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort in JS to avoid Firestore composite index requirement
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return docs;
  },

  getSampleById: async (id) => {
    const docRef = doc(db, 'samples', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Sample not found');
    }
  },

  uploadSample: async (formData) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const file = formData.get('file');
    if (!file) throw new Error('No file provided');

    // 1. Send the file to the local YOLOv12 FastAPI Backend
    const mlResponse = await fetch(ML_API_URL, {
      method: 'POST',
      body: formData // contains the file
    });

    if (!mlResponse.ok) {
      const errorMsg = await mlResponse.text();
      throw new Error(`AI Model Error: ${errorMsg}`);
    }

    const mlData = await mlResponse.json();

    // 2. Upload the ORIGINAL image to Firebase Storage
    const storageRef = ref(storage, `samples/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    // 3. Upload the ANNOTATED image to Firebase Storage
    // The backend returns a base64 string. We convert it to a Blob to upload to Storage
    // This prevents storing massive base64 strings in Firestore (1MB limit).
    const base64Response = await fetch(mlData.annotated_image_base64);
    const annotatedBlob = await base64Response.blob();
    const annotatedStorageRef = ref(storage, `samples/${user.uid}/${Date.now()}_annotated_${file.name}`);
    await uploadBytes(annotatedStorageRef, annotatedBlob);
    const annotatedImageUrl = await getDownloadURL(annotatedStorageRef);

    // 4. Save sample metadata + real YOLO detections to Firestore
    const sampleData = {
      userId: user.uid,
      fileName: file.name,
      location: formData.get('location') || 'Unknown',
      date: formData.get('date') || new Date().toISOString().split('T')[0],
      sampleType: formData.get('sampleType') || 'water',
      status: 'completed',
      severity: mlData.severity,
      particleCount: mlData.total_particles,
      particles: {
        fibers: mlData.particle_counts?.fiber || 0,
        films: mlData.particle_counts?.film || 0,
        fragments: mlData.particle_counts?.fragment || 0,
        pallets: mlData.particle_counts?.pallet || 0,
      },
      detections: mlData.detections, // store the raw bounding box data if needed
      imageUrl,
      annotatedImageUrl,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'samples'), sampleData);
    
    return {
      id: docRef.id,
      ...sampleData
    };
  },

  deleteSample: async (sample) => {
    // 1. Delete the Firestore document
    await deleteDoc(doc(db, 'samples', sample.id));

    // 2. Delete images from Firebase Storage (best-effort; don't fail if missing)
    const tryDelete = async (url) => {
      if (!url) return;
      try {
        // Extract the storage path from the download URL
        const decodedUrl = decodeURIComponent(url);
        const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
        if (pathMatch && pathMatch[1]) {
          const storageRef = ref(storage, pathMatch[1]);
          await deleteObject(storageRef);
        }
      } catch (e) {
        console.warn('Could not delete storage file:', e.message);
      }
    };

    await tryDelete(sample.imageUrl);
    await tryDelete(sample.annotatedImageUrl);
  },
};
