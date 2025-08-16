/* eslint-disable @next/next/no-html-link-for-pages */
import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Layout } from '../components/Layout';

export default function Home() {
  const { user, isLoading } = useUser();

  return (
    <Layout>
      <Head>
        <title>Auth Example</title>
      </Head>
      <main className="container">
        <h1>Welcome to the Auth Example App</h1>
        
        {isLoading ? (
          <p>Loading...</p>
        ) : user ? (
          <div>
            <p>Hello, {user.name}! You are successfully logged in.</p>
            <div style={{ marginTop: '2rem' }}>
              <Link href="/weather" className="btn" style={{ marginRight: '1rem' }}>
                View Weather
              </Link>
              <Link href="/protected" className="btn" style={{ marginRight: '1rem' }}>
                Protected Page
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p>This is the landing page. Please log in to access protected features.</p>
            <a className="btn" href="/api/auth/login">Login</a>
          </div>
        )}
      </main>
    </Layout>
  );
}
