'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Store the initialized services in a module-level variable to act as a singleton.
let firebaseServices: {
  firebaseApp: FirebaseApp,
  auth: ReturnType<typeof getAuth>,
  firestore: ReturnType<typeof getFirestore>
} | null = null;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // If the services have already been initialized, return the existing instances.
  if (firebaseServices) {
    return firebaseServices;
  }

  let app;
  if (!getApps().length) {
    // If no app is initialized, create one.
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      app = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      app = initializeApp(firebaseConfig);
    }
  } else {
    // If apps are already initialized, get the default app.
    app = getApp();
  }

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Sign in anonymously if not already signed in.
  if (!auth.currentUser) {
    signInAnonymously(auth).catch((error) => {
      console.error("Anonymous sign-in failed:", error);
    });
  }

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
