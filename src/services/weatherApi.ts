import { buildWeatherUrl, transformWeatherResponse } from '../lib/weatherTransforms';
import { OWM_BASE_URL } from '../config/mapConfig';
import type { OWMCurrentWeatherResponse, WeatherData } from '../types/weather';

/**
 * Fetches current weather for a coordinate from OpenWeatherMap Current Weather API 2.5.
 * Throws on non-ok HTTP responses or network errors.
 * The caller (useWeather hook) is responsible for error handling and cancellation.
 */
export async function fetchWeather(
  lat: number,
  lng: number,
  apiKey: string,
): Promise<WeatherData> {
  const url = buildWeatherUrl(lat, lng, apiKey, OWM_BASE_URL);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as OWMCurrentWeatherResponse;
  return transformWeatherResponse(data, lat, lng);
}
