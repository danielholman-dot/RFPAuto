'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect, DependencyList } from 'react';
import { FirebaseApp }from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export interface FirebaseContextState {
    firebaseApp: FirebaseApp | null;
    firestore: Firestore | null;
    auth: Auth | null;
    user: User | null;
    isUserLoading: boolean;
    userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export function FirebaseProvider({
    children,
    firebaseApp,
    firestore,
    auth,
}: {
    children: ReactNode;
    firebaseApp: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
}) {
    const [userAuthState, setUserAuthState] = useState<{
        user: User | null;
        isUserLoading: boolean;
        userError: Error | null;
    }>({
        user: null,
        isUserLoading: true,
        userError: null,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,
            (user) => setUserAuthState({ user, isUserLoading: false, userError: null }),
            (error) => {
                console.error("Firebase Auth Error:", error);
                setUserAuthState({ user: null, isUserLoading: false, userError: error });
            }
        );
        return () => unsubscribe();
    }, [auth]);

    const contextValue = useMemo(() => ({
        firebaseApp,
        firestore,
        auth,
        ...userAuthState,
    }), [firebaseApp, firestore, auth, userAuthState]);

    return (
        <FirebaseContext.Provider value={contextValue}>
            <FirebaseErrorListener />
            {children}
        </FirebaseContext.Provider>
    );
}

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider.');
    }
    return context;
};

export const useAuth = (): Auth => {
    const { auth } = useFirebase();
    if (!auth) throw new Error('Firebase Auth not available');
    return auth;
};

export const useFirestore = (): Firestore => {
    const { firestore } = useFirebase();
    if (!firestore) throw new Error('Firestore not available');
    return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
    const { firebaseApp } = useFirebase();
    if (!firebaseApp) throw new Error('Firebase App not available');
    return firebaseApp;
};

type MemoFirebase<T> = T & { __memo?: boolean };

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | MemoFirebase<T> {
    const memoized = useMemo(factory, deps);
    if (typeof memoized === 'object' && memoized !== null) {
        (memoized as MemoFirebase<T>).__memo = true;
    }
    return memoized;
}
