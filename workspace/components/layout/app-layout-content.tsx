
'use client';
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/sidebar";
import { Header } from "./header";
import { SidebarInset } from "../ui/sidebar";

export function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicPage = pathname === '/login' || pathname.startsWith('/proposal/submit');

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
    )
}
