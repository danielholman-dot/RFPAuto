
'use client';

import { User } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';

// In a real application, you would fetch this from Firestore or have it as a custom claim.
export type UserRole = 'gpo' | 'pm' | 'guest';

export interface AppUser extends User {
    role: UserRole;
}

export interface UseUserResult {
  user: AppUser | null;
  isUserLoading: boolean; // Keep consistent naming
  userError: Error | null;
}

/**
 * A hook to get the currently authenticated user from Firebase, including their role.
 *
 * @returns {UseUserResult} An object containing the user, loading state, and error.
 */
export const useUser = (): UseUserResult => {
    const { user, isUserLoading, userError } = useFirebase();

    // The user object from useFirebase might not have the 'role' yet.
    // We can augment it here.
    if (user) {
        // **DEVELOPMENT HOOK**: In a real app, you would fetch the user's role from
        // a Firestore 'users' collection or read it from a custom claim on the auth token.
        // For this prototype, we are assigning the 'gpo' role, which acts as the owner/admin.
        const appUser: AppUser = {
            ...user,
            role: 'gpo',
        };
        return { user: appUser, isUserLoading, userError };
    }

    return { user: null, isUserLoading, userError };
};

    