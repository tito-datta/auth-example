'use client';

import { UserProvider } from '@auth0/nextjs-auth0';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
