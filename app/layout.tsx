'use client'; // Important for client-side hooks

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import '@/styles/globals.css';
import Sidebar from '../components/Sidebar';
import LoadingPage from '../components/loading-page';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000); // Show loading for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" className="dark">
      <body className="bg-[121212] dark:bg-[#0d0d0d]">



        {isLoading ? (
          <LoadingPage />
        ) : (
          <div className="flex min-h-screen">
            {/* Sidebar is fixed, so body padding left to avoid overlap */}
            <Sidebar />
            <main className="flex-1 p-6 md:ml-64">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
