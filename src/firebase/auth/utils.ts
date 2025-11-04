
'use client';

import { getAuth, signInWithRedirect, GoogleAuthProvider, Auth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

export const signInWithGoogle = (auth: Auth) => {
  const provider = new GoogleAuthProvider();
  // We use signInWithRedirect which is more robust than signInWithPopup.
  // The result is handled in the FirebaseProvider.
  signInWithRedirect(auth, provider).catch((error: any) => {
    console.error("Error initiating Google sign-in redirect:", error);
    toast({
        variant: 'destructive',
        title: 'Google Login Failed',
        description: `Could not start the sign-in process. Error: ${error.message}`,
    });
  });
};

    