
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPublicPage = pathname.startsWith('/proposal/submit');

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
          {isPublicPage ? (
            <main>{children}</main>
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className='bg-background'>
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          )}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
