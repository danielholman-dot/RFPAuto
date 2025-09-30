
'use client';

import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';


function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, auth, isUserLoading } = useFirebase();

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider).catch((error) => {
        console.error("Error during automatic sign-in:", error);
      });
    }
  }, [isUserLoading, user, auth]);

  if (isUserLoading || !user) {
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
