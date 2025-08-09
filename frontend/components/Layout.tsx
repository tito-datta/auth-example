import { ReactNode } from 'react';
import { NavBar } from './NavBar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
