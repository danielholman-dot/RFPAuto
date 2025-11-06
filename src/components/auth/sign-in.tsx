
'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export function SignIn() {
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleSignIn = async () => {
        if (!auth || !firestore) {
            toast({
                variant: 'destructive',
                title: 'Firebase not initialized',
                description: 'The Firebase services could not be reached. Please try again later.',
            });
            return;
        }

        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user.email && !user.email.endsWith('@google.com')) {
                await auth.signOut();
                toast({
                    variant: 'destructive',
                    title: 'Access Denied',
                    description: 'Only users with a @google.com email address are permitted to log in.',
                });
                return;
            }

            const userRef = doc(firestore, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: 'Project Management', // Default role
                }, { merge: true });
            }
        } catch (error: any) {
            console.error("Firebase Auth Error:", error);
            toast({
                variant: 'destructive',
                title: 'Sign-in Failed',
                description: 'An internal authentication error occurred. Please check the browser console for details.',
            });
        }
    };

    return (
        <Button variant="outline" className="w-full" onClick={handleSignIn}>
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
        </Button>
    )
}
