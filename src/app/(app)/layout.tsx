
'use client';

import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  // While loading, or if there's no user yet (and we're about to redirect),
  // show a loading screen. This prevents the children from rendering prematurely.
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-3">Loading user session...</p>
      </div>
    );
  }

  if (error) {
    // You might want to show a more specific error page here
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <p className="ml-3 text-red-500">Error loading user session. Please try again.</p>
        </div>
    );
  }
  
  // If loading is done and we have a user, render the protected content.
  return <>{children}</>;
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
