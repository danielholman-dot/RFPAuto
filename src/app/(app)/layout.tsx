
'use client';

import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getRedirectResult } from 'firebase/auth';

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const auth = useAuth();
    const [isHandlingRedirect, setIsHandlingRedirect] = useState(true);

    useEffect(() => {
      getRedirectResult(auth)
        .catch((error) => {
          console.error('Error processing redirect result:', error);
        })
        .finally(() => {
          setIsHandlingRedirect(false);
        });
    }, [auth]);

    useEffect(() => {
      if (!userLoading && !isHandlingRedirect && !user) {
        router.push('/login');
      }
    }, [user, userLoading, isHandlingRedirect, router]);

    if (userLoading || isHandlingRedirect) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (!user) {
      // This prevents a flash of the content before the redirect happens.
      return null;
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
