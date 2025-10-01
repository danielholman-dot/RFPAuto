
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FilePlus2,
  Book,
  Users,
  Settings,
  Map,
  FileText,
  Briefcase,
  HelpCircle,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuth, useUser } from '@/firebase';

export function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();

  const isActive = (path: string) => {
    if (path === '/rfp' && pathname.startsWith('/rfp/')) return true;
    if (path === '/templates' && pathname.startsWith('/templates')) return true;
    return pathname === path;
  };

  const handleLogout = async () => {
    if (auth) {
        await auth.signOut();
    }
  }

  // RBAC: Determine if the user has the 'gpo' role
  const isGpo = user?.role === 'gpo';

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <Briefcase className="w-8 h-8 text-sidebar-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground font-headline">MARCUS</h1>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        <SidebarGroup>
          <SidebarMenuItem>
            <Link href="/dashboard" passHref>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard')}
                tooltip={{ children: 'Dashboard' }}
              >
                <span>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/rfp/new" passHref>
              <SidebarMenuButton
                asChild
                isActive={isActive('/rfp/new')}
                tooltip={{ children: 'New RFP' }}
              >
                <span>
                  <FilePlus2 />
                  <span>New RFP</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/rfp" passHref>
              <SidebarMenuButton
                asChild
                isActive={isActive('/rfp')}
                tooltip={{ children: 'RFP Registry' }}
              >
                <span>
                  <Book />
                  <span>RFP Registry</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/templates" passHref>
              <SidebarMenuButton
                asChild
                isActive={isActive('/templates')}
                tooltip={{ children: 'Templates' }}
              >
                <span>
                  <FileText />
                  <span>Templates</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/contractors" passHref>
              <SidebarMenuButton
                asChild
                isActive={isActive('/contractors')}
                tooltip={{ children: 'Contractors' }}
              >
                <span>
                  <Users />
                  <span>Contractors</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          {/* RBAC: Only show Metro link if user is GPO */}
          {isGpo && (
            <SidebarMenuItem>
              <Link href="/metro" passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/metro')}
                  tooltip={{ children: 'Metro' }}
                >
                  <span>
                    <Map />
                    <span>Metro</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarGroup>
      </SidebarMenu>

      <SidebarFooter className="mt-auto">
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/go-live" passHref>
                <SidebarMenuButton
                    asChild
                    isActive={isActive('/go-live')}
                    tooltip={{ children: 'To-Do List' }}
                >
                    <span>
                    <ClipboardList />
                    <span>To-Do List</span>
                    </span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/user-guide" passHref>
                <SidebarMenuButton
                    asChild
                    isActive={isActive('/user-guide')}
                    tooltip={{ children: 'User Guide' }}
                >
                    <span>
                    <HelpCircle />
                    <span>User Guide</span>
                    </span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          {/* RBAC: Only show Settings link if user is GPO */}
          {isGpo && (
            <SidebarMenuItem>
                <Link href="/settings" passHref>
                <SidebarMenuButton
                    asChild
                    isActive={isActive('/settings')}
                    tooltip={{ children: 'Settings' }}
                >
                    <span>
                    <Settings />
                    <span>Settings</span>
                    </span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
           )}
          <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip={{ children: 'Log Out' }}
              >
                <span>
                  <LogOut />
                  <span>Log Out</span>
                </span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
