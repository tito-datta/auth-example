import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Weather App</h1>
      <p>Simple authenticated weather application.</p>
      <div className="space-x-4">
        <Link className="text-blue-600 underline" href="/api/auth/login">Login</Link>
        <Link className="text-blue-600 underline" href="/weather">Weather (protected)</Link>
      </div>
    </main>
  );
}
