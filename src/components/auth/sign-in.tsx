'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SignIn() {
    const auth = useAuth();
    const { toast } = useToast();

    const handleSignIn = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                toast({
                    title: "Signed In",
                    description: `Welcome back, ${user.displayName}!`,
                });
            })
            .catch((error) => {
                console.error("Error signing in with Google:", error);
                toast({
                    variant: 'destructive',
                    title: 'Google Login Failed',
                    description: `Could not sign in. Error: ${error.message}`,
                });
            });
    };

    return (
        <Button variant="outline" className="w-full" onClick={handleSignIn}>
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
        </Button>
    )
}
