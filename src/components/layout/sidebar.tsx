
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
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/rfp' && pathname.startsWith('/rfp/')) return true;
    if (path === '/templates' && pathname.startsWith('/templates')) return true;
    return pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          {/* You can replace this placeholder with your own logo */}
          <Image 
            src="https://picsum.photos/seed/logo/40/40" 
            alt="Company Logo"
            width={40}
            height={40}
            className="rounded-md"
            data-ai-hint="logo"
          />
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
        <div className="p-2 group-data-[collapsible=icon]:hidden">
            <Link href="/rfp/new">
                <Button className="w-full">
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    New RFP
                </Button>
            </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
