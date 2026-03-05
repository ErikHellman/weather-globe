import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWeather } from '../../services/weatherApi';
import { buildWeatherUrl } from '../../lib/weatherTransforms';
import { OWM_BASE_URL } from '../../config/mapConfig';
import type { OWMOneCallResponse } from '../../types/weather';

const MOCK_RESPONSE: OWMOneCallResponse = {
  lat: 48.8566,
  lon: 2.3522,
  timezone: 'Europe/Paris',
  timezone_offset: 3600,
  current: {
    dt: 1700000000,
    sunrise: 1699999000,
    sunset: 1700020000,
    temp: 15.0,
    feels_like: 13.5,
    pressure: 1015,
    humidity: 65,
    dew_point: 8.0,
    uvi: 1.2,
    clouds: 20,
    visibility: 10000,
    wind_speed: 3.5,
    wind_deg: 180,
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  },
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
