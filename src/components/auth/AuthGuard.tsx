
"use client";

import type { ReactNode } from 'react';
// No longer using useAuth, useRouter, usePathname for auth-specific logic

export function AuthGuard({ children }: { children: ReactNode }) {
  // Since authentication is removed, AuthGuard essentially just passes children through.
  // No loading state or redirection logic is needed based on authentication.
  return <>{children}</>;
}
