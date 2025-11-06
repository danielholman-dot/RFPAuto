
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
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        try {
            await signInWithPopup(auth, provider);
            // The onAuthStateChanged listener in FirebaseProvider will handle profile creation.
        } catch (error: any) {
            // Log the full error object for detailed diagnostics
            console.error("Firebase Auth Error:", error);

            // Provide a user-friendly error message
            toast({
                variant: 'destructive',
                title: 'Sign-in Failed',
                description: 'Could not sign in with Google. Please try again.',
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
