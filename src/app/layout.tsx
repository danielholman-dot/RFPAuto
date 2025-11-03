'use client';

import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { SidebarProvider } from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const isPublicPage = pathname === '/' || pathname.startsWith('/proposal/submit');
  const isAppPage = !isPublicPage;

  useEffect(() => {
    if (!isUserLoading) {
      if (isAppPage && !user) {
        // If on an app page and not logged in, redirect to login
        router.replace('/');
      } else if (pathname === '/' && user) {
        // If on login page and logged in, redirect to dashboard
        router.replace('/dashboard');
      }
    }
  }, [user, isUserLoading, router, pathname, isAppPage]);

  if ((isUserLoading && isAppPage) || (isUserLoading && user)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAppPage && user) {
     return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-background">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
     )
  }

  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>MARCUS Automation Suite</title>
        <meta name="description" content="MARCUS Automation Suite for RFP Management" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <FirebaseClientProvider>
           <AppContent>{children}</AppContent>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
