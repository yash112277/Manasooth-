"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export type SupportedLanguage = 'en' | 'hi'; // Add more languages as needed

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: Dispatch<SetStateAction<SupportedLanguage>>;
  translate: (translations: Record<SupportedLanguage, string> | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_LANGUAGE_KEY = 'manasooth_language';
const SUPPORTED_LANGUAGES_ARRAY: SupportedLanguage[] = ['en', 'hi'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with default, will be updated by useEffect on client
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // This effect runs only on the client after mount
    const storedLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) as SupportedLanguage | null;
    if (storedLanguage && SUPPORTED_LANGUAGES_ARRAY.includes(storedLanguage)) { // Validate stored language
      setLanguage(storedLanguage);
    }
  }, []); // Runs once on mount to load language from localStorage

  useEffect(() => {
    // This effect runs on the client whenever 'language' changes
    // (and after the initial state is set, including from localStorage)
    if (typeof window !== 'undefined') { // Ensure localStorage is only accessed on client
        localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
        // Optionally, set the lang attribute on the HTML element
        document.documentElement.lang = language;
    }
  }, [language]); // Runs whenever language state changes

  const translate = (translations: Record<SupportedLanguage, string> | string): string => {
    if (typeof translations === 'string') {
      // If a single string is passed, assume it's a key for a larger translation system (not implemented here)
      // or return the string itself if no system exists. For now, return the string.
      return translations;
    }
    return translations[language] || translations['en'] || 'Translation missing';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
