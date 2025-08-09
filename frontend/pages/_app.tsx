import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
