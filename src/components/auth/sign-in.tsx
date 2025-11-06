'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Chrome } from "lucide-react";

export function SignIn() {
    const auth = useAuth();

    const handleSignIn = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        // The result is now handled by the onAuthStateChanged listener in FirebaseProvider
        signInWithPopup(auth, provider).catch((error) => {
            // The listener in the provider will handle success, we only need to catch pop-up errors here.
            console.error("Popup sign-in error:", error);
        });
    };

    return (
        <Button variant="outline" className="w-full" onClick={handleSignIn}>
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
        </Button>
    )
}
