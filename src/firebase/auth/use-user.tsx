
'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/provider';
import type { User } from 'firebase/auth';

// Define a mock user structure that aligns with what your app might expect
const mockUser: User = {
    uid: 'mock-user-id-12345',
    email: 'user@example.com',
    displayName: 'Demo User',
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    // Add other required User properties with mock values
} as unknown as User;

interface UseUserResult {
  user: User | null;
  isUserLoading: boolean;
}

/**
 * A hook that provides a mock user object.
 * This is used to bypass real authentication for demonstration or development purposes.
 * It simulates a loading state and then provides a static user object.
 */
export const useUser = (): UseUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    // Simulate an async check for a user
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsUserLoading(false);
    }, 500); // A short delay to mimic network latency

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return { user, isUserLoading };
};
