
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useFirebase } from "@/firebase/provider";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { LogIn, LogOut } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";

export function Header() {
  const { user, auth, isUserLoading } = useFirebase();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        {/* Can be used for a search bar later */}
      </div>

      {!isClient || isUserLoading ? (
        <Skeleton className="h-8 w-32" />
      ) : user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{user.displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" onClick={handleLogin}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      )}
    </header>
  )
}
