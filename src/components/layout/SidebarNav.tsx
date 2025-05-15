
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { navItemsConfig } from '@/lib/navigation'; // Import from new location

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { translate } = useLanguage();

  return (
    <SidebarMenu>
      {navItemsConfig.map((item) => {
        const isDisabled = item.requiresAuth && !user;
        const effectiveHref = isDisabled ? '#' : item.href;
        const label = translate(item.translations);
        
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={!isDisabled && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))}
              tooltip={{ children: label, className: "bg-card text-card-foreground border-border"}}
              className={cn(
                (!isDisabled && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))))
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              aria-label={label}
            >
              <Link href={effectiveHref} onClick={isDisabled ? (e) => e.preventDefault() : undefined}>
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
