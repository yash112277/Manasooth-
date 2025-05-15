"use client";

import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext'; // Import LanguageProvider
// import { ThemeProvider } from "next-themes"; // Example if you add theme switching

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  // If you were to add ThemeProvider:
  // return (
  //   <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  //     <LanguageProvider> {/* Add LanguageProvider here */}
  //       <AuthProvider>
  //         {children}
  //       </AuthProvider>
  //     </LanguageProvider>
  //   </ThemeProvider>
  // );
  return (
    <LanguageProvider> {/* Add LanguageProvider here */}
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}
