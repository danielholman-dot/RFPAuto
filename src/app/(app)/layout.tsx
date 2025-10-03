
'use client';

import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getRedirectResult } from 'firebase/auth';

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const { user, loading } = useUser();
    const router = useRouter();
    const auth = useAuth();

    useEffect(() => {
      // This handles the redirect result from Google Sign-In
      // It should be placed in a layout that is loaded after the redirect.
      getRedirectResult(auth).catch((error) => {
        console.error('Error processing redirect result:', error);
      });
    }, [auth]);

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
}


function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

export default withAuth(AppLayout);
