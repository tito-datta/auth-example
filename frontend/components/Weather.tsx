'use client';
import React, { useEffect, useState } from 'react';

interface WeatherData {
  name: string;
  main: { temp: number };
  weather: { description: string }[];
}

interface WeatherProps {
  city: string;
}

export function Weather({ city }: WeatherProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error('Failed to fetch weather');
        const json: WeatherData = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (loading) return <div className="animate-pulse">Loading weather...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return null;
  return (
    <div className="p-4 rounded border bg-white shadow w-full max-w-sm">
      <h2 className="text-xl font-semibold mb-2">{data.name}</h2>
      <p className="text-4xl font-bold">{Math.round(data.main.temp)}°C</p>
      <p className="capitalize text-gray-600">{data.weather[0].description}</p>
    </div>
  );
}
