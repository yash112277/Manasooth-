
"use client";

import type { ReactNode } from 'react';
import { useState } 
from 'react'; 
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SidebarNav } from './SidebarNav';
import Link from 'next/link';
import { Settings, PanelLeft, Menu, X } from 'lucide-react'; // Removed LogOut, UserCircle, LogIn
// Removed useAuth as login features are gone
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Not needed
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"; // Not needed
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LanguageSwitcher } from './LanguageSwitcher';
import { navItemsConfig } from '@/lib/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: ReactNode }) {
  // const { user, signOut, loading } = useAuth(); // Auth features removed
  const { translate } = useLanguage();
  const pathname = usePathname();
  const [isHeaderNavVisible, setIsHeaderNavVisible] = useState(false);

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 items-center">
          <Link href="/" className="flex items-center gap-2 hover:no-underline">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
              <path d="M12 2a5 5 0 0 0-5 5c0 1.3.5 2.5 1.4 3.4L5 13.8V21h3.8l3.6-3.6A5 5 0 0 0 12 22a5 5 0 0 0 5-5c0-1.3-.5-2.5-1.4-3.4L19 10.2V3h-3.8l-3.6 3.6A5 5 0 0 0 12 2zM7 21v-2M17 3v2"/>
              <path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              <path d="M12 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
            <span className="font-semibold text-xl group-data-[collapsible=icon]:hidden">Manasooth</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
           <Button 
            variant="ghost" 
            className="w-full justify-start group-data-[collapsible=icon]:justify-center"
            title="Settings"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="ml-2 group-data-[collapsible=icon]:hidden">Settings</span>
            </Link>
          </Button>
          {/* Logout button removed */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger aria-label="Toggle sidebar">
              <PanelLeft className="h-6 w-6" />
            </SidebarTrigger>
            <Link href="/" className="flex items-center gap-2 hover:no-underline md:hidden">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
                <path d="M12 2a5 5 0 0 0-5 5c0 1.3.5 2.5 1.4 3.4L5 13.8V21h3.8l3.6-3.6A5 5 0 0 0 12 22a5 5 0 0 0 5-5c0-1.3-.5-2.5-1.4-3.4L19 10.2V3h-3.8l-3.6 3.6A5 5 0 0 0 12 2zM7 21v-2M17 3v2"/>
                <path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                <path d="M12 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
              <span className="font-semibold text-lg">Manasooth</span>
            </Link>
          </div>
          
          {isHeaderNavVisible && (
            <nav className="hidden md:flex flex-grow justify-center">
              <Menubar className="rounded-none border-none bg-transparent shadow-none">
                {navItemsConfig.map((item) => {
                  // const isDisabled = item.requiresAuth && !user; // Auth logic removed
                  const isDisabled = false; // No items are auth-restricted now
                  const effectiveHref = isDisabled ? '#' : item.href;
                  const label = translate(item.translations);
                  return (
                    <MenubarMenu key={item.href}>
                      <MenubarTrigger asChild className={cn(
                          "font-medium data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                          (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) && !isDisabled && "text-primary underline underline-offset-4 decoration-2 decoration-primary/70",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={isDisabled}
                        aria-disabled={isDisabled}
                      >
                        <Link href={effectiveHref} onClick={isDisabled ? (e) => e.preventDefault() : undefined}>
                          {label}
                        </Link>
                      </MenubarTrigger>
                    </MenubarMenu>
                  );
                })}
              </Menubar>
            </nav>
          )}
          {!isHeaderNavVisible && <div className="hidden md:flex flex-grow justify-center"></div>}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsHeaderNavVisible(prev => !prev)}
              className="hidden md:inline-flex"
              aria-label={isHeaderNavVisible ? "Minimize main navigation" : "Maximize main navigation"}
            >
              {isHeaderNavVisible ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <LanguageSwitcher />
            {/* User avatar and login/logout buttons removed */}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
        </main>
        <footer className="py-6 px-4 md:px-6 lg:px-8 border-t bg-card text-card-foreground text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Manasooth. All rights reserved.</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
