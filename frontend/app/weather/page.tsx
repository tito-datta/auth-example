'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { WeatherCard } from '../components/WeatherCard';
import { WeatherData } from '../types/weather';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WeatherPage() {
  const { user, error: authError, isLoading: isAuthLoading } = useUser();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeatherData() {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        console.error('Error fetching weather:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeatherData();
  }, [user]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {authError.message}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Please <Link href="/api/auth/login" className="text-blue-500 hover:text-blue-700">log in</Link> to view the weather.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weather Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.name}</p>
          </div>
          <Link
            href="/api/auth/logout"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Log Out
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          {isLoading ? (
            <div className="text-xl">Loading weather data...</div>
          ) : error ? (
            <div className="text-red-500 text-center max-w-md">
              <p className="text-xl font-semibold mb-2">Error</p>
              <p>{error}</p>
            </div>
          ) : weatherData ? (
            <WeatherCard weather={weatherData} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
