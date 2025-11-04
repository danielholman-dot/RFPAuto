
'use client';

import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The main layout logic is now handled in the root layout (src/app/layout.tsx).
  // This layout file remains for structure but can be simplified as the parent handles the shell.
  return (
    <>
      {/* The AppSidebar and Header are now rendered by the AppContent component in the root layout */}
      {children}
    </>
  );
}

export default AppLayout;
