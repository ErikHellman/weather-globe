import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWeather } from '../../services/weatherApi';
import { buildWeatherUrl } from '../../lib/weatherTransforms';
import { OWM_BASE_URL } from '../../config/mapConfig';
import type { OWMCurrentWeatherResponse } from '../../types/weather';

const MOCK_RESPONSE: OWMCurrentWeatherResponse = {
  coord: { lon: 2.3522, lat: 48.8566 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  base: 'stations',
  main: {
    temp: 15.0,
    feels_like: 13.5,
    temp_min: 13.0,
    temp_max: 17.0,
    pressure: 1015,
    humidity: 65,
  },
  visibility: 10000,
  wind: { speed: 3.5, deg: 180 },
  clouds: { all: 20 },
  dt: 1700000000,
  sys: {
    type: 2,
    id: 2041230,
    country: 'FR',
    sunrise: 1699999000,
    sunset: 1700020000,
  },
  timezone: 3600,
  id: 2988507,
  name: 'Paris',
  cod: 200,
};

function makeFetchResponse(body: unknown, ok = true, status = 200, statusText = 'OK') {
  return {
    ok,
    status,
    statusText,
    json: () => Promise.resolve(body),
  };
}

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls fetch with the URL built from buildWeatherUrl', async () => {
    vi.mocked(fetch).mockResolvedValue(makeFetchResponse(MOCK_RESPONSE) as Response);

    await fetchWeather(48.8566, 2.3522, 'mykey');

    const expectedUrl = buildWeatherUrl(48.8566, 2.3522, 'mykey', OWM_BASE_URL);
    expect(fetch).toHaveBeenCalledWith(expectedUrl);
  });

  it('returns transformed WeatherData on success', async () => {
    vi.mocked(fetch).mockResolvedValue(makeFetchResponse(MOCK_RESPONSE) as Response);

    const result = await fetchWeather(48.8566, 2.3522, 'mykey');

    expect(result.temp).toBe(15.0);
    expect(result.condition).toBe('clear sky');
    expect(result.locationLabel).toBe('48.8566, 2.3522');
  });

  it('throws with status info on a 404 response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      makeFetchResponse(null, false, 404, 'Not Found') as Response,
    );

    await expect(fetchWeather(0, 0, 'key')).rejects.toThrow('404');
    await expect(fetchWeather(0, 0, 'key')).rejects.toThrow('Not Found');
  });

  it('throws with status info on a 500 response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      makeFetchResponse(null, false, 500, 'Internal Server Error') as Response,
    );

    await expect(fetchWeather(0, 0, 'key')).rejects.toThrow('500');
  });

  it('re-throws network errors', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(fetchWeather(0, 0, 'key')).rejects.toThrow('Failed to fetch');
  });

  it('includes the api key in the URL', async () => {
    vi.mocked(fetch).mockResolvedValue(makeFetchResponse(MOCK_RESPONSE) as Response);

    await fetchWeather(0, 0, 'supersecretkey');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('supersecretkey'));
  });
});
