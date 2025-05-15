"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/signup'];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (user && PUBLIC_AUTH_PATHS.includes(pathname)) {
        // If user is logged in and on a public auth page (login/signup), redirect to home.
        router.replace('/');
      }
      // For "optional login", we no longer redirect non-authenticated users from main app pages.
      // Individual pages should handle the 'user' being null and adapt their behavior
      // (e.g., use localStorage for anonymous users, prompt to login for certain features).
    }
  }, [user, loading, router, pathname]);

  // Show a global loading spinner for non-auth pages while auth state is loading.
  // Auth pages (login/signup) typically handle their own loading indicators.
  if (loading && !PUBLIC_AUTH_PATHS.includes(pathname)) {
     return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If auth is loaded, render children. Pages themselves will adapt to user being null or authenticated.
  return <>{children}</>;
}
