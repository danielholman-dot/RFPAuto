
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';


// --- Initialize Firebase and Services ---
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// Initialize Firebase only once
if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

auth = getAuth(app);
firestore = getFirestore(app);

const initializeFirebase = () => ({ app, auth, firestore });


// --- Export Initialized Services ---
export { app, auth, firestore, initializeFirebase };

// --- Export Hooks, Providers, and Utilities ---
export * from './provider';
export * from './client-provider';
export { default as useCollection } from './firestore/use-collection';
export * from './firestore/use-doc';
export { useAuthState };
export * from './errors';
export * from './error-emitter';
