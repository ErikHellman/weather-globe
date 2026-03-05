import type { OWMCurrentWeather, OWMOneCallResponse, WeatherData } from '../types/weather';

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
 * Builds the OWM One Call API 3.0 request URL.
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
    exclude: 'minutely,hourly,daily,alerts',
    units: 'metric',
    appid: apiKey,
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Transforms a raw OWM One Call API response into a display-ready WeatherData object.
 * Pure function: no I/O, no side effects.
 */
export function transformWeatherResponse(
  response: OWMOneCallResponse,
  lat: number,
  lng: number,
): WeatherData {
  const c: OWMCurrentWeather = response.current;
  const offset = response.timezone_offset;
  const condition = c.weather[0];

  return {
    locationLabel: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    condition: condition?.description ?? 'unknown',
    iconUrl: buildIconUrl(condition?.icon ?? '01d'),
    temp: c.temp,
    feelsLike: c.feels_like,
    dewPoint: c.dew_point,
    humidity: c.humidity,
    pressure: c.pressure,
    clouds: c.clouds,
    uvIndex: c.uvi,
    visibility: metersToKm(c.visibility),
    windSpeed: c.wind_speed,
    windDeg: c.wind_deg,
    windCompass: degreesToCompass(c.wind_deg),
    windGust: c.wind_gust ?? null,
    rain1h: c.rain?.['1h'] ?? null,
    snow1h: c.snow?.['1h'] ?? null,
    sunrise: formatUnixToLocalTime(c.sunrise, offset),
    sunset: formatUnixToLocalTime(c.sunset, offset),
  };
}
