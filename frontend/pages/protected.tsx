import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';

function ProtectedPage() {
  return (
    <>
      <Head><title>Protected</title></Head>
      <main className='container'>
        <h1>Protected Content</h1>
        <p>You can see this because you are logged in.</p>
      </main>
    </>
  );
}

export default withPageAuthRequired(ProtectedPage);
