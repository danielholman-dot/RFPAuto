
'use client';

import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    // If the user is already logged in, redirect them to the dashboard.
    // This prevents logged-in users from seeing the login page.
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      // Use signInWithRedirect for a full-page login flow.
      signInWithRedirect(auth, provider);
    }
  };

  // While checking the user's auth state or if they are being redirected, show a loader.
  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-3">Loading application...</p>
      </div>
    );
  }

  // If not loading and no user, show the main login page.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted">
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <Briefcase className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="text-3xl font-bold mt-4">MARCUS Automation Suite</CardTitle>
                <CardDescription>Google Procurement System</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={handleSignIn} size="lg">
                    Sign in with Google
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
