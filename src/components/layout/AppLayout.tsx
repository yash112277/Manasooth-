
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
import { Settings, LogOut, UserCircle, LogIn, PanelLeft, Menu, X } from 'lucide-react'; 
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const { user, signOut, loading } = useAuth();
  const { translate } = useLanguage();
  const pathname = usePathname();
  const [isHeaderNavVisible, setIsHeaderNavVisible] = useState(false); // Default to minimized

  const getInitials = (email?: string | null) => {
    if (!email) return "U";
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length > 1 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <SidebarProvider defaultOpen={false}> {/* Default to minimized */}
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
          {user && (
             <Button 
              variant="ghost" 
              className="w-full justify-start group-data-[collapsible=icon]:justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Logout"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2 group-data-[collapsible=icon]:hidden">Logout</span>
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-2">
            {/* SidebarTrigger is now visible on desktop as well to toggle sidebar expand/collapse */}
            <SidebarTrigger aria-label="Toggle sidebar">
              <PanelLeft className="h-6 w-6" />
            </SidebarTrigger>
            <Link href="/" className="flex items-center gap-2 hover:no-underline md:hidden"> {/* Logo for mobile */}
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
                <path d="M12 2a5 5 0 0 0-5 5c0 1.3.5 2.5 1.4 3.4L5 13.8V21h3.8l3.6-3.6A5 5 0 0 0 12 22a5 5 0 0 0 5-5c0-1.3-.5-2.5-1.4-3.4L19 10.2V3h-3.8l-3.6 3.6A5 5 0 0 0 12 2zM7 21v-2M17 3v2"/>
                <path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                <path d="M12 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
              <span className="font-semibold text-lg">Manasooth</span>
            </Link>
          </div>
          
          {/* Desktop Navigation Menu - Conditionally rendered */}
          {isHeaderNavVisible && (
            <nav className="hidden md:flex flex-grow justify-center">
              <Menubar className="rounded-none border-none bg-transparent shadow-none">
                {navItemsConfig.map((item) => {
                  const isDisabled = item.requiresAuth && !user;
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
          {/* Empty div to help with justify-center if nav is hidden but we want to maintain layout */}
          {!isHeaderNavVisible && <div className="hidden md:flex flex-grow justify-center"></div>}


          <div className="flex items-center gap-2">
             {/* Button to toggle header navigation visibility (desktop only) */}
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
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Signed in as</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !loading && !user ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
            ) : null}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
        </main>
        <footer className="py-6 px-4 md:px-6 lg:px-8 border-t bg-card text-card-foreground text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Manasooth. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-1">Created by Yash Kashyap & Atul Kumar Kanojia.</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
