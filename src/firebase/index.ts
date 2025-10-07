'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This module-level variable will hold the single initialized Firebase services instance.
let firebaseServices: {
  firebaseApp: FirebaseApp,
  auth: ReturnType<typeof getAuth>,
  firestore: ReturnType<typeof getFirestore>
} | null = null;

/**
 * Initializes and/or returns a singleton instance of Firebase services.
 * This function ensures that Firebase is only initialized once per application lifecycle.
 * @returns The singleton Firebase services object.
 */
export function initializeFirebase() {
  // If the services have already been initialized, return the existing instances immediately.
  if (firebaseServices) {
    return firebaseServices;
  }

  // Check if a Firebase app has already been initialized. If not, initialize one.
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Store the initialized services in the singleton variable.
  firebaseServices = {
    firebaseApp: app,
    auth,
    firestore,
  };

  return firebaseServices;
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';