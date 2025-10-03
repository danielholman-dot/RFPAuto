
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // This effect now only handles redirecting an already-logged-in user away from the login page.
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // signInWithRedirect is a non-blocking call.
    // We don't need to await it; it will trigger a page redirect.
    signInWithRedirect(auth, provider);
  };
  
  // Display a loader only if we are in the initial loading phase and don't know the user's status yet.
  // Do not show a loader if a user object already exists, as the useEffect will handle the redirect.
  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );
  }

  // If a user is already present, the useEffect will redirect.
  // To prevent a brief flash of the login form, we can return null or a loader.
  if (user) {
    return (
      <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>MARCUS Automation Suite</CardTitle>
          <CardDescription>Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleSignIn} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
