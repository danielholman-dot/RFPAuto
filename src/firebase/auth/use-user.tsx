
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase';

export interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * A hook to get the currently authenticated user from Firebase.
 *
 * @returns {UseUserResult} An object containing the user, loading state, and error.
 */
export const useUser = (): UseUserResult => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      // If auth is not ready, we are still in a loading state.
      // We don't set an error because the provider might just be initializing.
      setLoading(true);
      return;
    }

    setLoading(true);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Authentication error:", error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]); // Rerun effect when auth object becomes available.

  return { user, loading, error };
};
