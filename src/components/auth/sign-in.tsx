
'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
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
            // Use signInWithRedirect instead of signInWithPopup
            // This navigates the user to the Google sign-in page and then returns them to the app.
            // The result is handled by the onAuthStateChanged listener and getRedirectResult.
            await signInWithRedirect(auth, provider);
        } catch (error: any) {
            console.error("Firebase Auth Redirect Error:", error);
            toast({
                variant: 'destructive',
                title: 'Sign-in Failed',
                description: 'Could not start the sign-in process. Please check the browser console for details.',
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
