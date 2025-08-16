'use client';
import { Weather } from '../../components/Weather';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function WeatherPage() {
  const { user, error, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-red-600">Error: {error.message}</div>
      </main>
    );
  }
  
  if (!user) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Weather Dashboard</h1>
          <p className="text-gray-600">You must be logged in to view weather data.</p>
          <Link 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors" 
            href="/api/auth/login"
          >
            Login with Auth0
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
        </div>
        <div className="space-x-4">
          <Link 
            className="text-blue-600 hover:text-blue-800 underline" 
            href="/"
          >
            Home
          </Link>
          <Link 
            className="text-red-600 hover:text-red-800 underline" 
            href="/api/auth/logout"
          >
            Logout
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Weather */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Today's Weather</h2>
          <Weather mode="today" />
        </div>

        {/* 5-Day Forecast */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">5-Day Forecast</h2>
          <Weather mode="forecast" />
        </div>
      </div>
    </main>
  );
}
