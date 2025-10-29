'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    
    // Initialize App Check for development
    if (process.env.NODE_ENV !== 'production') {
        try {
            // This property is set by the `self.FIREBASE_APPCHECK_DEBUG_TOKEN` in next.config.js
            (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
            initializeAppCheck(firebaseApp, {
                provider: new ReCaptchaV3Provider('6Ld8m5spAAAAAOi-B7s3p-s8iV_u_G_gO4t_uYwF'),
                isTokenAutoRefreshEnabled: true
            });
            console.log("Firebase App Check initialized in development mode.");
        } catch(e) {
            console.error("Failed to initialize Firebase App Check", e);
        }
    }


    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
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
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
