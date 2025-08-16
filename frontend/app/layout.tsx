import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import React from 'react';

export const metadata = {
  title: 'Weather App',
  description: 'Authenticated weather app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
