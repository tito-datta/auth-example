import Head from 'next/head';
import { Weather } from '../components/Weather';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function WeatherPage() {
  return (
    <>
      <Head><title>Weather</title></Head>
      <main className='container'>
        <h1>Weather Forecast</h1>
        <Weather />
      </main>
    </>
  );
}

export default withPageAuthRequired(WeatherPage);
