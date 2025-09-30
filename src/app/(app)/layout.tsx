
'use client';

import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';


function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, auth, isUserLoading } = useFirebase();
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsHandlingRedirect(false);
      return;
    }

    // When the component mounts, check if there's a redirect result
    getRedirectResult(auth)
      .then((result) => {
        // If result is null, it means we are not coming back from a redirect
        // or the user closed the login page.
        // The onAuthStateChanged listener will handle the user state.
      })
      .catch((error) => {
        console.error("Error handling redirect result:", error);
      })
      .finally(() => {
        setIsHandlingRedirect(false);
      });

  }, [auth]);

  useEffect(() => {
    // This effect triggers the redirect if the user is not logged in
    // and we are not currently handling a redirect result.
    if (!isUserLoading && !user && auth && !isHandlingRedirect) {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider).catch((error) => {
        console.error("Error during sign-in redirect:", error);
      });
    }
  }, [isUserLoading, user, auth, isHandlingRedirect]);

  // Show a loading screen while checking auth state or handling the redirect
  if (isUserLoading || isHandlingRedirect || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-3">Authenticating...</p>
      </div>
    );
  }

  return <>{children}</>;
}


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AuthWrapper>
        <AppSidebar />
        <SidebarInset className='bg-background'>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </AuthWrapper>
    </SidebarProvider>
  );
}
