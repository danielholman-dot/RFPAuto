
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
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
      return;
    }
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const landingImage = PlaceHolderImages.find(img => img.id === 'dashboard-hero');

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-3">Loading session...</p>
      </div>
    );
  }
  
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
