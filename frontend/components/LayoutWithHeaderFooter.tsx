"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import Header from './Header';
import Footer from './Footer';
import React from 'react';

export default function LayoutWithHeaderFooter({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const headerUser = user
    ? {
        name: user.name || 'User',
        email: user.email || '',
        profilePicture: user.picture || '/default-profile.png',
      }
    : {
        name: 'Guest',
        email: '',
        profilePicture: '/default-profile.png',
      };
  return (
    <>
      <Header user={headerUser} />
      <div className="min-h-[80vh]">{children}</div>
      <Footer />
    </>
  );
}
