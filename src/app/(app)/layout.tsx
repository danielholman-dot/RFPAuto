
'use client';

import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useFirebase } from '@/firebase';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    // If the initial auth state check is done and there's still no user,
    // redirect them to the root login page.
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  // While checking the user's auth state, show a full-screen loading indicator.
  // This prevents any of the protected app from rendering until the user is confirmed.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-3">Authenticating...</p>
      </div>
    );
  }
  
  // If a user is found, render the protected app content.
  if (user) {
    return <>{children}</>;
  }

  // If there's no user and we are not loading, the useEffect above will trigger a redirect.
  // Render a loading state while the redirect happens to prevent flashing content.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="ml-3">Redirecting to login...</p>
    </div>
  );
}


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className='bg-background'>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
