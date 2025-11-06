
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
    if (!user || !firestore) return undefined;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  // Pass a third argument to useDocumentData to ensure it returns an ID.
  const [appUser, userLoading, userError] = useDocumentData<AppUser>(userDocRef, {
    idField: 'id',
  });

  // The overall loading state is true if either the auth state or the user profile is loading.
  const isLoading = authLoading || (user && userLoading);

  const memoizedUser = useMemo(() => {
    if (user && appUser) {
      // Combine the auth user and the app user profile.
      return { ...appUser, uid: user.uid };
    }
    return null;
  }, [user, appUser]);

  const userState = useMemo(() => ({
    user: memoizedUser,
    isUserLoading: isLoading,
    userError: authError || userError,
  }), [memoizedUser, isLoading, authError, userError]);

  return userState;
};
