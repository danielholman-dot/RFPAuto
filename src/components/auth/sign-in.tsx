'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SignIn() {
    const auth = useAuth();
    const { toast } = useToast();

    const handleSignIn = async () => {
        if (!auth) {
            toast({
                variant: 'destructive',
                title: 'Firebase not initialized',
                description: 'The Firebase auth service could not be reached. Please try again later.',
            });
            return;
        }

        const provider = new GoogleAuthProvider();
        
        try {
            // The user profile creation and validation is handled by the onAuthStateChanged
            // listener in the FirebaseProvider, so we only need to trigger the sign-in here.
            await signInWithPopup(auth, provider);
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
