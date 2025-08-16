import { render, screen } from '@testing-library/react';
import { Weather } from '../components/Weather';

// Mock fetch
const mockJson = jest.fn();
// @ts-ignore
global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ name: 'London', main: { temp: 12 }, weather: [{ description: 'clear sky' }] }) }));

describe('Weather', () => {
  it('renders loading then weather data', async () => {
    render(<Weather city="London" />);
    expect(screen.getByText(/Loading weather/i)).toBeInTheDocument();
    expect(await screen.findByText('London')).toBeInTheDocument();
    expect(await screen.findByText(/°C/)).toBeInTheDocument();
  });
});
