
'use client';

import { useMemo } from 'react';
import type { User as AuthUser } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import type { User as AppUser } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useAuth } from '../provider';

export const useUser = () => {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, authLoading, authError] = useAuthState(auth);

  // Directly use the user's UID to get the document reference.
  const userDocRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  // Use the useDocument hook from react-firebase-hooks for a direct subscription.
  const [userDoc, userLoading, userError] = useDocument(userDocRef);

  const appUser = useMemo(() => {
    if (userDoc?.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as AppUser;
    }
    return null;
  }, [userDoc]);

  const isLoading = authLoading || userLoading;

  const userState = useMemo(() => ({
    user: appUser,
    isUserLoading: isLoading,
    userError: authError || userError,
  }), [appUser, isLoading, authError, userError]);

  return userState;
};
