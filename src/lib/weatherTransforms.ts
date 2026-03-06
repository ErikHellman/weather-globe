import type { OWMCurrentWeatherResponse, WeatherData } from '../types/weather';

const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

/**
 * Converts a wind bearing in degrees to a 16-point compass abbreviation.
 */
export function degreesToCompass(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return COMPASS_POINTS[index];
}

/**
 * Converts a Unix timestamp + timezone offset (seconds) to "HH:MM" local time.
 * Uses UTC math so it works in all environments without Intl timezone support.
 */
export function formatUnixToLocalTime(
  unixSeconds: number,
  timezoneOffsetSeconds: number,
): string {
  const localMs = unixSeconds * 1000 + timezoneOffsetSeconds * 1000;
  const d = new Date(localMs);
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Converts meters to kilometers, rounded to one decimal place.
 */
export function metersToKm(meters: number): number {
  return Math.round(meters / 100) / 10;
}

/**
 * Builds the OpenWeatherMap weather icon URL for a given icon code.
 */
export function buildIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Builds the OWM Current Weather API 2.5 request URL.
 * Pure function so it can be tested independently of the fetch call.
 */
export function buildWeatherUrl(
  lat: number,
  lng: number,
  apiKey: string,
  baseUrl: string,
): string {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    units: 'metric',
    appid: apiKey,
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Transforms a raw OWM Current Weather API response into a display-ready WeatherData object.
 * Pure function: no I/O, no side effects.
 */
export function transformWeatherResponse(
  response: OWMCurrentWeatherResponse,
  lat: number,
  lng: number,
): WeatherData {
  const condition = response.weather[0];
  const offset = response.timezone;

  return {
    locationLabel: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    condition: condition?.description ?? 'unknown',
    iconUrl: buildIconUrl(condition?.icon ?? '01d'),
    temp: response.main.temp,
    feelsLike: response.main.feels_like,
    humidity: response.main.humidity,
    pressure: response.main.pressure,
    clouds: response.clouds.all,
    visibility: metersToKm(response.visibility),
    windSpeed: response.wind.speed,
    windDeg: response.wind.deg,
    windCompass: degreesToCompass(response.wind.deg),
    windGust: response.wind.gust ?? null,
    rain1h: response.rain?.['1h'] ?? null,
    snow1h: response.snow?.['1h'] ?? null,
    sunrise: formatUnixToLocalTime(response.sys.sunrise, offset),
    sunset: formatUnixToLocalTime(response.sys.sunset, offset),
  };
}
