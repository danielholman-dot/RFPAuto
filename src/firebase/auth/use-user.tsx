'use client';

import type { User } from '@/lib/types';
import { useMemo } from 'react';

// A mock user for a public-only app experience
const mockUser: User = {
    id: 'public-user-01',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'Google Procurement Office', // Provide a default role with max permissions
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1080',
};


/**
 * Hook for accessing a user object in a public-only app.
 * It returns a mock user object and bypasses actual authentication.
 */
export const useUser = () => {
  
  const userState = useMemo(() => ({
    user: mockUser,
    isUserLoading: false, // Never loading as the user is hardcoded
    userError: null,      // No errors as there's no auth process
  }), []);

  return userState;
};
