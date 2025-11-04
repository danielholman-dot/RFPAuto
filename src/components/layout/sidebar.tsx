
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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true;
    if (path !== '/dashboard' && pathname.startsWith(path)) return true;
    return false;
  };

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
                isActive={isActive('/rfp') && !isActive('/rfp/new')}
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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
