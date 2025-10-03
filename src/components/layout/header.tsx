
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar"

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        {/* Can be used for a search bar later */}
      </div>
    </header>
  )
}
