import { useEffect, useState, useCallback } from 'react';
import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';

interface WeatherData { temperatureC: number; temperatureF: number; summary: string; date: string; }

function WeatherInner() {
  const { user, error: userError } = useUser();
  const [data, setData] = useState<WeatherData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); 
    setError(null);
    
    try {
      // For now, make a simple request without token
      // TODO: Add token authentication after setting up Auth0 API
      const res = await fetch(`${API_BASE_URL}/weatherforecast`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      
      const json = await res.json();
      setData(json);
    } catch (e: any) {
    } catch (e: unknown) {
      let message = 'An unknown error occurred';
      if (typeof e === 'object' && e !== null && 'message' in e && typeof (e as any).message === 'string') {
        message = (e as any).message;
      }
      setError(message);
      console.error('Weather API error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    if (user) {
      load(); 
    }
  }, [load, user]);

  if (userError) {
    return <p style={{color:'tomato'}}>Authentication error: {userError.message}</p>;
  }

  return (
    <section>
      <h2>Weather</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'tomato'}}>{error}</p>}
      <ul style={{listStyle:'none', padding:0}}>
        {data?.map(w => (
          <li key={w.date} style={{border:'1px solid #30363d', margin:'0.75rem 0', padding:'0.75rem', borderRadius:6}}>
            <strong>{new Date(w.date).toLocaleDateString()}:</strong> {w.summary} - {w.temperatureC}°C / {w.temperatureF}°F
          </li>
        ))}
      </ul>
      <button onClick={load} className='btn'>Reload</button>
    </section>
  );
}

export const Weather = withPageAuthRequired(WeatherInner);
