import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherApi';
import type { MapClickCoords } from '../types/map';
import type { WeatherState } from '../types/weather';

/**
 * Fetches current weather whenever coords change.
 * Uses AbortController to suppress stale results when coords change rapidly.
 * Returns a WeatherState discriminated union.
 */
export function useWeather(coords: MapClickCoords | null, apiKey: string): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: 'idle' });

  useEffect(() => {
    if (!coords) {
      setState({ status: 'idle' });
      return;
    }

    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchWeather(coords.lat, coords.lng, apiKey)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data });
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          const message = err instanceof Error ? err.message : 'Failed to fetch weather';
          setState({ status: 'error', message });
        }
      });

    return () => {
      controller.abort();
    };
  }, [coords, apiKey]);

  return state;
}
