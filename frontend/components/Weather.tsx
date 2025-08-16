'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { apiService, WeatherForecast, ApiError } from '../lib/api';

interface WeatherProps {
  mode?: 'today' | 'forecast';
}

export function Weather({ mode = 'forecast' }: WeatherProps) {
  const { user, error: authError, isLoading: authLoading } = useUser();
  const [data, setData] = useState<WeatherForecast | WeatherForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get access token for API calls
  useEffect(() => {
    async function fetchWeatherWithToken() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const { accessToken } = await response.json();
          let result;
          if (mode === 'today') {
            result = await apiService.getTodayWeather(accessToken);
          } else {
            result = await apiService.getWeatherForecast(accessToken);
          }
          setData(result);
        } else {
          const errorData = await response.json();
          setError(`Failed to get access token: ${errorData.error}`);
        }
      } catch (e) {
        setError('Failed to get access token - network error');
      } finally {
        setLoading(false);
      }
    }
    fetchWeatherWithToken();
  }, [user, mode]);

  // Removed second useEffect; handled in fetchWeatherWithToken

  if (authLoading) {
    return <div className="animate-pulse text-gray-900 dark:text-gray-100">Authenticating... (Auth0 SDK loading)</div>;
  }

  if (authError) {
    return <div className="text-red-600 dark:text-red-400">Authentication error: {authError.message}</div>;
  }

  if (!user) {
    return (
      <div className="text-yellow-600 dark:text-yellow-300 p-4 border border-yellow-300 dark:border-dark-border rounded bg-yellow-50 dark:bg-dark-bg-secondary">
        <p className="font-semibold">Not logged in</p>
        <p>Please log in to view weather data</p>
        <a href="/api/auth/login" className="text-blue-600 dark:text-blue-400 underline">Login here</a>
      </div>
    );
  }


  if (loading) {
    return <div className="animate-pulse text-gray-900 dark:text-dark-text">Loading weather data...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-300 p-4 border border-red-300 dark:border-dark-border rounded bg-red-50 dark:bg-dark-bg-secondary">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return <div className="text-gray-600 dark:text-dark-text-secondary">No weather data available</div>;
  }

  // Render single day weather
  if (mode === 'today' && !Array.isArray(data)) {
    return (
      <div className="p-4 rounded border bg-white dark:bg-dark-bg-secondary shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-dark-text">Today's Weather</h2>
        <p className="text-4xl font-bold text-gray-900 dark:text-dark-text">{data.temperatureC}°C</p>
        <p className="text-lg text-gray-600 dark:text-dark-text-secondary">{data.temperatureF}°F</p>
        <p className="capitalize text-gray-600 dark:text-dark-text-secondary mt-2">{data.summary}</p>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">{new Date(data.date).toLocaleDateString()}</p>
      </div>
    );
  }

  // Render 5-day forecast
  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">5-Day Weather Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((forecast, index) => (
            <div key={index} className="p-4 rounded border bg-white dark:bg-dark-bg-secondary shadow">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-dark-text">
                {new Date(forecast.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{forecast.temperatureC}°C</p>
              <p className="text-gray-600 dark:text-dark-text-secondary">{forecast.temperatureF}°F</p>
              <p className="capitalize text-gray-700 dark:text-dark-text-secondary mt-1">{forecast.summary}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
