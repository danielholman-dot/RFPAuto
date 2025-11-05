'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  // This check is a safeguard, but in practice, pages outside this layout are handled at the root.
  const isPublicPage = pathname.startsWith('/proposal/submit') || pathname === '/login';
  const isHomepage = pathname === '/';

  if (isPublicPage || isHomepage) {
    return <main>{children}</main>;
  }

  if (isUserLoading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Authenticating...</p>
        </div>
    );
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset className='bg-background'>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}

export default AppLayout;
