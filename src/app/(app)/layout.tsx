
'use client';

import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  // While checking for user, show a loader
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there's a user, show the main app layout
  return (
    <>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}

export default AppLayout;
