
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

// In a real application, you would fetch this from Firestore or have it as a custom claim.
export type UserRole = 'gpo' | 'pm' | 'guest';

export interface AppUser extends User {
    role: UserRole;
}

export interface UseUserResult {
  user: AppUser | null;
  loading: boolean;
  error: Error | null;
}

/**
 * A hook to get the currently authenticated user from Firebase, including their role.
 *
 * @returns {UseUserResult} An object containing the user, loading state, and error.
 */
export const useUser = (): UseUserResult => {
  const auth = useAuth();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
            // **DEVELOPMENT HOOK**: In a real app, you would fetch the user's role from
            // a Firestore 'users' collection or read it from a custom claim on the auth token.
            // For this prototype, we are assigning the 'gpo' role, which acts as the owner/admin.
            const appUser: AppUser = {
                ...firebaseUser,
                role: 'gpo',
            };
            setUser(appUser);
        } else {
            setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Authentication error:", error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return { user, loading, error };
};
