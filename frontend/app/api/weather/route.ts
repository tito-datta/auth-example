import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { WeatherData } from '@/app/types/weather';

// Simple in-memory cache
const cache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/api/weather`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data from backend');
    }

    const cacheKey = session.user.sub as string;
    const cachedData = cache.get(cacheKey);
    
    // Return cached data if valid
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data);
    }

    const data = await response.json();
    
    // Validate response data
    if (!isValidWeatherData(data)) {
      throw new Error('Invalid weather data received from backend');
    }

    // Cache the new data
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch weather data';
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && error.message.includes('Invalid') ? 422 : 500 }
    );
  }
}

// Type guard for weather data
function isValidWeatherData(data: unknown): data is WeatherData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const weather = data as Record<string, unknown>;
  
  return (
    typeof weather.temperature === 'number' &&
    typeof weather.description === 'string' &&
    typeof weather.location === 'string' &&
    (weather.humidity === undefined || typeof weather.humidity === 'number') &&
    (weather.windSpeed === undefined || typeof weather.windSpeed === 'number') &&
    (weather.feelsLike === undefined || typeof weather.feelsLike === 'number')
  );
}
