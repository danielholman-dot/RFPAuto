'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // The initializeFirebase function now correctly acts as a singleton.
  // We can call it directly to get the single instance of our services.
  const firebaseServices = initializeFirebase();

  // The anonymous sign-in logic should only run once on the client.
  useEffect(() => {
    if (firebaseServices.auth.currentUser === null) {
      signInAnonymously(firebaseServices.auth).catch((error) => {
        console.error("Anonymous sign-in failed on client:", error);
      });
    }
  }, [firebaseServices.auth]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
