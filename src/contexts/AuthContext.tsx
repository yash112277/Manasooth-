
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';
// Firebase User type might still be imported if other parts of the app expect it,
// but actual Firebase Auth instance won't be used.
import type { User } from 'firebase/auth'; 

interface AuthContextType {
  user: User | null; // Will always be null
  loading: boolean; // Will always be false
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  signUp: (email: string, pass: string) => Promise<User | null>;
  signIn: (email: string, pass: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  // Mock implementations as auth is removed
  const signUp = async (email: string, pass: string): Promise<User | null> => {
    setError("Signup feature is currently disabled.");
    console.warn("Attempted to call signUp, but feature is disabled.");
    return null;
  };

  const signIn = async (email: string, pass: string): Promise<User | null> => {
    setError("Login feature is currently disabled.");
    console.warn("Attempted to call signIn, but feature is disabled.");
    return null;
  };

  const signOut = async () => {
    console.warn("Attempted to call signOut, but feature is disabled.");
    // No user state to change, no router push needed.
  };
  
  return (
    <AuthContext.Provider value={{ 
      user: null, // User is always null
      loading: false, // Loading is always false
      error, 
      setError, 
      signUp, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This provider will no longer be in AppProviders.
    // Components calling useAuth should be updated or this hook should return default non-authed state.
    // For now, to prevent immediate errors in existing components, we'll return a safe default.
    // Ideally, refactor components to not call useAuth or handle its absence.
     return {
      user: null,
      loading: false,
      error: null,
      setError: () => {},
      signUp: async () => null,
      signIn: async () => null,
      signOut: async () => {},
    } as AuthContextType;
    // A more robust solution would be to remove useAuth calls from components.
    // throw new Error('useAuth must be used within an AuthProvider - OR - AuthProvider has been removed.');
  }
  return context;
}
