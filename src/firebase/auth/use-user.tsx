
'use client';

import { useMemo } from 'react';
import type { User as AuthUser } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import type { User as AppUser } from '@/lib/types';
import { useFirestore, useAuth } from '../provider';
import { doc } from 'firebase/firestore';

export const useUser = () => {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, authLoading, authError] = useAuthState(auth);

  const userDocRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const [appUser, userLoading, userError] = useDocumentData(userDocRef);

  const isLoading = authLoading || userLoading;

  const memoizedUser = useMemo(() => {
    if (appUser) {
      return { ...appUser, uid: user!.uid } as AppUser;
    }
    return null;
  }, [appUser, user]);

  const userState = useMemo(() => ({
    user: memoizedUser,
    isUserLoading: isLoading,
    userError: authError || userError,
  }), [memoizedUser, isLoading, authError, userError]);

  return userState;
};
