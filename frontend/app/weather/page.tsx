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

      {/* Debug Information */}
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
        <p className="text-sm text-gray-600">
          This page fetches weather data from your secured backend API using Auth0 JWT tokens.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Backend API: http://localhost:5223
        </p>
        <div className="mt-4 space-x-2">
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/debug/session');
                const data = await response.json();
                alert(JSON.stringify(data, null, 2));
              } catch (e) {
                alert('Error checking session: ' + (e instanceof Error ? e.message : 'Unknown error'));
              }
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Check Session
          </button>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/auth/token');
                const data = await response.json();
                if (response.ok) {
                  alert('Token received successfully! Check console for details.');
                  console.log('Access token:', data.accessToken);
                } else {
                  alert('Token error: ' + JSON.stringify(data, null, 2));
                }
              } catch (e) {
                alert('Network error: ' + (e instanceof Error ? e.message : 'Unknown error'));
              }
            }}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Test Token
          </button>
        </div>
      </div>
    </main>
  );
}
