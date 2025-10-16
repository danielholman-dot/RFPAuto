'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // This check is a safeguard, but in practice, pages outside this layout are handled at the root.
  const isPublicPage = pathname.startsWith('/proposal/submit');

  if (isPublicPage) {
    return <main>{children}</main>;
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
