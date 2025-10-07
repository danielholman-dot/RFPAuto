'use client';

import { usersData } from '@/lib/data';
import type { User } from '@/lib/types';

/**
 * Hook for accessing the authenticated user's state.
 * NOTE: Authentication is currently disabled. This hook returns a mock user.
 */
export const useUser = () => {
  // Return the first user from the mock data as the logged-in user.
  const mockUser = usersData[0] as User;

  return {
    user: mockUser,
    isUserLoading: false, // Always false as we are not fetching a real user.
    userError: null,
  };
};
