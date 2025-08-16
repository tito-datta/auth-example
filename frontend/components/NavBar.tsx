/* eslint-disable @next/next/no-html-link-for-pages */
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export function NavBar() {
  const { user } = useUser();
  return (
    <nav style={{display:'flex', justifyContent:'space-between', padding:'1rem'}}>
      <Link href="/">Home</Link>
      <div>
        {user ? (
          <>
            <span style={{marginRight:'1rem'}}>Hi {user.name}</span>
            <a className="btn" href="/api/auth/logout">Logout</a>
          </>
        ) : (
          <a className="btn" href="/api/auth/login">Login</a>
        )}
      </div>
    </nav>
  );
}
