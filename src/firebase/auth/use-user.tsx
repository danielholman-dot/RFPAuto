'use client';

import { useFirebase } from '@/firebase/provider';
import type { User } from '@/lib/types';

/**
 * Hook for accessing the authenticated user's state.
 * It returns the user object from the Firebase context.
 */
export const useUser = () => {
  const { user, isUserLoading, userError } = useFirebase();
  // The user object from the provider already conforms to the User type.
  return {
    user: user as User | null,
    isUserLoading,
    userError,
  };
};
