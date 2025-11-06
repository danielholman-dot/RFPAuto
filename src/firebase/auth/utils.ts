
'use client';

import { signInWithPopup, GoogleAuthProvider, Auth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "..";

export const signInWithGoogle = (auth: Auth) => {
  const provider = new GoogleAuthProvider();
  // Add standard scopes to ensure profile data is requested correctly.
  provider.addScope('profile');
  provider.addScope('email');
  
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) {
        throw new Error("Could not get credential from result.");
      }
      // The signed-in user info.
      const user = result.user;
      
      // Create or update the user document in Firestore.
      const userRef = doc(firestore, "users", user.uid);
      setDoc(userRef, { 
          name: user.displayName, 
          email: user.email,
          avatar: user.photoURL,
          id: user.uid,
          role: "Project Management", // Assign a default role
      }, { merge: true });

      toast({
        title: "Signed In",
        description: `Welcome back, ${user.displayName}!`,
      });

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      
      console.error("Error signing in with Google:", { errorCode, errorMessage, email, credential });
      toast({
          variant: 'destructive',
          title: 'Google Login Failed',
          description: `Could not sign in. Error: ${errorMessage}`,
      });
    });
};
