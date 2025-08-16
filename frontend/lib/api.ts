// API service for backend integration with Auth0 JWT tokens

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5223';

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface UserInfo {
  isAuthenticated: boolean;
  name?: string;
  claims: Array<{ type: string; value: string }>;
}

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    accessToken?: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        errorText || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return response.json();
  }

  // Public endpoints (no auth required)
  async getHealthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.makeRequest('/health');
  }

  async getAuthInstructions(): Promise<any> {
    return this.makeRequest('/auth/instructions');
  }

  // Protected endpoints (require JWT token)
  async getTodayWeather(accessToken: string): Promise<WeatherForecast> {
    return this.makeRequest('/weather', accessToken);
  }

  async getWeatherForecast(accessToken: string): Promise<WeatherForecast[]> {
    return this.makeRequest('/weatherforecast', accessToken);
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    return this.makeRequest('/user', accessToken);
  }
}

export const apiService = new ApiService();
export { ApiService };
