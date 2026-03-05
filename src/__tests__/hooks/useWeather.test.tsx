import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../services/weatherApi');

import { fetchWeather } from '../../services/weatherApi';
import { useWeather } from '../../hooks/useWeather';
import type { WeatherData } from '../../types/weather';
import type { MapClickCoords } from '../../types/map';

const mockFetchWeather = vi.mocked(fetchWeather);

const MOCK_WEATHER_DATA: WeatherData = {
  locationLabel: '51.5074, -0.1278',
  condition: 'few clouds',
  iconUrl: 'https://openweathermap.org/img/wn/02d@2x.png',
  temp: 12.5,
  feelsLike: 10.1,
  dewPoint: 8.7,
  humidity: 78,
  pressure: 1013,
  clouds: 40,
  uvIndex: 0.5,
  visibility: 9.5,
  windSpeed: 5.2,
  windDeg: 220,
  windCompass: 'SW',
  windGust: 8.0,
  rain1h: null,
  snow1h: null,
  sunrise: '07:30',
  sunset: '16:45',
};

const COORDS: MapClickCoords = { lat: 51.5074, lng: -0.1278 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useWeather', () => {
  it('returns idle state when coords is null', () => {
    const { result } = renderHook(() => useWeather(null, 'apikey'));
    expect(result.current.status).toBe('idle');
  });

  it('transitions to loading immediately when coords are set', async () => {
    // Use a promise that never resolves to capture the loading state
    mockFetchWeather.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useWeather(COORDS, 'apikey'));

    // Loading should be immediate (synchronous state update in useEffect)
    expect(result.current.status).toBe('loading');
  });

  it('transitions to success after fetch resolves', async () => {
    mockFetchWeather.mockResolvedValue(MOCK_WEATHER_DATA);

    const { result } = renderHook(() => useWeather(COORDS, 'apikey'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.status).toBe('success');
    if (result.current.status === 'success') {
      expect(result.current.data).toEqual(MOCK_WEATHER_DATA);
    }
  });

  it('transitions to error when fetchWeather throws an Error', async () => {
    mockFetchWeather.mockRejectedValue(new Error('Weather API error: 401 Unauthorized'));

    const { result } = renderHook(() => useWeather(COORDS, 'apikey'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.status).toBe('error');
    if (result.current.status === 'error') {
      expect(result.current.message).toContain('401');
    }
  });

  it('uses a generic message when the thrown value is not an Error', async () => {
    mockFetchWeather.mockRejectedValue('string error');

    const { result } = renderHook(() => useWeather(COORDS, 'apikey'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.status).toBe('error');
    if (result.current.status === 'error') {
      expect(result.current.message).toBe('Failed to fetch weather');
    }
  });

  it('returns to idle when coords is set back to null', async () => {
    mockFetchWeather.mockResolvedValue(MOCK_WEATHER_DATA);

    const { result, rerender } = renderHook(
      ({ coords }: { coords: MapClickCoords | null }) => useWeather(coords, 'apikey'),
      { initialProps: { coords: COORDS } },
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.status).toBe('success');

    act(() => {
      rerender({ coords: null });
    });

    expect(result.current.status).toBe('idle');
  });

  it('calls fetchWeather with the correct lat, lng, and apiKey', async () => {
    mockFetchWeather.mockResolvedValue(MOCK_WEATHER_DATA);

    renderHook(() => useWeather(COORDS, 'myapikey'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockFetchWeather).toHaveBeenCalledWith(COORDS.lat, COORDS.lng, 'myapikey');
  });

  it('does not call fetchWeather when coords is null', () => {
    renderHook(() => useWeather(null, 'apikey'));
    expect(mockFetchWeather).not.toHaveBeenCalled();
  });
});
