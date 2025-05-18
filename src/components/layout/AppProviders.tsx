
"use client";

import type { ReactNode } from 'react';
// AuthProvider is removed
import { LanguageProvider } from '@/contexts/LanguageContext'; 

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      {/* AuthProvider has been removed */}
      {children}
    </LanguageProvider>
  );
}
