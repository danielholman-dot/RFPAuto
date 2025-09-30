
'use client';

import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, getRedirectResult, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';


function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { auth } = useFirebase();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    // This is the primary listener for auth state changes.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);
  
  useEffect(() => {
    if (!auth) return;
  
    // This effect handles the result of a sign-in redirect.
    // It should run on mount to catch the redirect from the IdP.
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User has just signed in via redirect.
          // The onAuthStateChanged listener will handle the user state update.
          setLoading(true); // Show loading while auth state propagates
        }
      })
      .catch((error) => {
        console.error("Error processing redirect result:", error);
      });

  }, [auth]);


  useEffect(() => {
    // This effect triggers the redirect if there's no user after the initial check.
    if (!loading && !user && auth) {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);
    }
  }, [loading, user, auth]);


  if (loading || !user) {
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
