import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  collection, 
  where, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Resume } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// Provider
const googleProvider = new GoogleAuthProvider();

// Error handling types and helper as mandated by firebase-integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authentication Wrappers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // After sign in, create a user record in the 'users' collection
    if (result.user) {
      await saveUserProfile(result.user);
    }
    return result.user;
  } catch (error) {
    console.error("Auth popup failed:", error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
}

// Save User Profile Profile History Master Core Layer
export async function saveUserProfile(user: User) {
  const path = `users/${user.uid}`;
  try {
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save or Update Resume Data
export async function saveResumeToCloud(resume: Resume): Promise<void> {
  const path = `resumes/${resume.id}`;
  try {
    // Standard secure data cleanup
    const cleanResume = {
      ...resume,
      createdAt: resume.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, 'resumes', resume.id), cleanResume);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch all resumes for specific user
export async function fetchUserResumes(uid: string): Promise<Resume[]> {
  const path = 'resumes';
  try {
    const q = query(collection(db, 'resumes'), where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const list: Resume[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Resume);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Delete specific resume document
export async function deleteResumeFromCloud(resumeId: string): Promise<void> {
  const path = `resumes/${resumeId}`;
  try {
    await deleteDoc(doc(db, 'resumes', resumeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
