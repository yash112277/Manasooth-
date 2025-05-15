
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  type User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, firebaseInitializedSuccessfully } from '@/lib/firebase'; 
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  signUp: (email: string, pass: string) => Promise<User | null>;
  signIn: (email: string, pass: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!firebaseInitializedSuccessfully) {
      console.error("AuthContext: Firebase was not initialized successfully. Auth operations will not work.");
      setError("Authentication service is unavailable due to Firebase initialization issues. Please ensure your .env file is configured correctly.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (authError) => {
      console.error("AuthContext: Error in onAuthStateChanged subscription:", authError);
      setError("Error listening to authentication state: " + authError.message);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []); 

  const signUp = async (email: string, pass: string): Promise<User | null> => {
    if (!firebaseInitializedSuccessfully) {
      setError("Authentication service is unavailable.");
      setLoading(false);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      return null;
    }
  };

  const signIn = async (email: string, pass: string): Promise<User | null> => {
    if (!firebaseInitializedSuccessfully) {
      setError("Authentication service is unavailable.");
      setLoading(false);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      return null;
    }
  };

  const signOut = async () => {
    if (!firebaseInitializedSuccessfully) {
      setError("Authentication service is unavailable.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        router.push('/auth/login');
      }
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, error, setError, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
