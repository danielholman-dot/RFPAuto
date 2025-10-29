
'use client';

import { getAuth, signInWithPopup, GoogleAuthProvider, Auth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

export const signInWithGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // User signed in successfully. The onAuthStateChanged listener will handle the redirect.
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    toast({
        variant: 'destructive',
        title: 'Google Login Failed',
        description: error.message,
    });
    return null;
  }
};
