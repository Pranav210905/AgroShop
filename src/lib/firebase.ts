import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLYP68rkbNqX-sXuapnBySl0Hww6b2bxw",
  authDomain: "assignmentproject-ea801.firebaseapp.com",
  projectId: "assignmentproject-ea801",
  storageBucket: "assignmentproject-ea801.firebasestorage.app",
  messagingSenderId: "835233581078",
  appId: "1:835233581078:web:21d311f005047051f18d37",
  measurementId: "G-F6QFB7GWB2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize default admin account
export async function initializeDefaultAdmin() {
  try {
    await createUserWithEmailAndPassword(auth, 'Pranav2105@gmail.com', 'Pra@123');
  } catch (error: any) {
    // Ignore if user already exists
    if (error.code !== 'auth/email-already-in-use') {
      console.error('Error creating default admin:', error);
    }
  }
}


