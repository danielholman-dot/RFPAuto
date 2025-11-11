
'use client';

import { usePathname, useRouter, redirect } from 'next/navigation';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/proposal/submit') && pathname !== '/login') {
      router.push('/login');
    }
  }, [loading, user, router, pathname]);

  const isPublicPage = pathname.startsWith('/proposal/submit') || pathname === '/login';
  
  // This logic is now handled in page.tsx and the effect above
  // const isHomepage = pathname === '/';
  // if (isHomepage) {
  //   if (loading) {
  //       return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  //   }
  //   if (!user) {
  //       redirect('/login');
  //   } else {
  //       redirect('/dashboard');
  //   }
  // }
  
  if (isPublicPage) {
    return <main>{children}</main>;
  }


  if (loading || (!user && !isPublicPage)) {
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
