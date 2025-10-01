
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { areServicesAvailable, auth } = useFirebase();

  const handleSignIn = () => {
    if (!auth) {
      console.error("Auth service is not available.");
      // You could show a toast or message to the user here.
      return;
    }
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        router.push('/dashboard');
      }).catch((error) => {
        // Handle specific cases where user closes the popup.
        if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
          // Don't log this error, it's expected user behavior.
          return;
        }

        // Handle other Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Login failed:", errorCode, errorMessage);
        // You could show a toast to the user here.
      });
  };

  useEffect(() => {
    // If the user is logged in, redirect them to the dashboard.
    // This is useful for users who are already signed in and revisit the root URL.
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const landingImage = PlaceHolderImages.find(img => img.id === 'procurement-landing');
  
  // Show a loading spinner while checking auth state or if user exists (to redirect).
  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-3">Loading session...</p>
      </div>
    );
  }
  
  // If not loading and no user, show the login page.
  return (
     <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to access the MARCUS Automation Suite
            </p>
          </div>
          <div className="grid gap-4">
             <button
              onClick={handleSignIn}
              disabled={!areServicesAvailable}
              className="w-full justify-center"
            >
              <Image 
                src="https://developers.google.com/static/identity/images/branding_guideline_sample_lt_rd_lg.svg" 
                alt="Sign in with Google"
                width={191}
                height={46}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {landingImage && (
            <Image
                src={landingImage.imageUrl}
                alt={landingImage.description}
                width="1920"
                height="1080"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                data-ai-hint={landingImage.imageHint}
            />
        )}
      </div>
    </div>
  );
}
