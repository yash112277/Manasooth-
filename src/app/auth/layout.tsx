
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="flex items-center justify-center gap-2 hover:no-underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
              <path d="M12 2a5 5 0 0 0-5 5c0 1.3.5 2.5 1.4 3.4L5 13.8V21h3.8l3.6-3.6A5 5 0 0 0 12 22a5 5 0 0 0 5-5c0-1.3-.5-2.5-1.4-3.4L19 10.2V3h-3.8l-3.6 3.6A5 5 0 0 0 12 2zM7 21v-2M17 3v2"/>
              <path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              <path d="M12 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
            <span className="font-semibold text-4xl text-foreground">Manasooth</span>
        </Link>
        <p className="text-muted-foreground mt-2">Your mental wellness companion.</p>
      </div>
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
