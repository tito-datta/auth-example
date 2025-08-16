
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import React from 'react';
import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Weather App',
  description: 'Authenticated weather app'
};


// Dynamically import the client layout wrapper
const LayoutWithHeaderFooter = dynamic(
  () => import('../components/LayoutWithHeaderFooter'),
  { ssr: false }
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <UserProvider>
          <LayoutWithHeaderFooter>{children}</LayoutWithHeaderFooter>
        </UserProvider>
      </body>
    </html>
  );
}
