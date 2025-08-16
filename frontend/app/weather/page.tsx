import { Weather } from '../../components/Weather';
import { getSession } from '@auth0/nextjs-auth0';
import Link from 'next/link';

export default async function WeatherPage() {
  const session = await getSession();
  if (!session) {
    return (
      <main className="p-8">
        <p>You must be logged in to view this page.</p>
        <Link className="text-blue-600 underline" href="/api/auth/login">Login</Link>
      </main>
    );
  }
  return (
    <main className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Weather</h1>
        <Link className="text-blue-600 underline" href="/api/auth/logout">Logout</Link>
      </div>
      <Weather city="London" />
    </main>
  );
}
