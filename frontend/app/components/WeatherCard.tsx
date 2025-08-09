'use client';

import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{weather.location}</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl font-bold text-blue-600">
            {Math.round(weather.temperature)}°C
          </div>
          <p className="text-xl text-gray-600 capitalize">{weather.description}</p>
          
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {weather.humidity !== undefined && (
              <div className="text-center">
                <p className="text-gray-500">Humidity</p>
                <p className="text-lg font-semibold">{weather.humidity}%</p>
              </div>
            )}
            {weather.windSpeed !== undefined && (
              <div className="text-center">
                <p className="text-gray-500">Wind Speed</p>
                <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
              </div>
            )}
            {weather.feelsLike !== undefined && (
              <div className="text-center col-span-2">
                <p className="text-gray-500">Feels Like</p>
                <p className="text-lg font-semibold">{Math.round(weather.feelsLike)}°C</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
