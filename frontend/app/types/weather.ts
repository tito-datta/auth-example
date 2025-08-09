export interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: number;
}
