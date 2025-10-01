
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUser } from "@/firebase/auth/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Header() {
  const { user } = useUser();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        {/* Can be used for a search bar later */}
      </div>
      {user && (
         <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden sm:inline-block">{user.displayName || user.email}</span>
            <Avatar>
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback>
                    {user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </div>
      )}
    </header>
  )
}
