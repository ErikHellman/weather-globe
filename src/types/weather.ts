export interface OWMWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OWMCurrentWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  rain?: { '1h': number };
  snow?: { '1h': number };
  weather: OWMWeatherCondition[];
}

export interface OWMOneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: OWMCurrentWeather;
}

/** Display-ready weather data for the panel (all metric). */
export interface WeatherData {
  locationLabel: string;
  condition: string;
  iconUrl: string;
  temp: number;
  feelsLike: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  clouds: number;
  uvIndex: number;
  visibility: number; // km
  windSpeed: number; // m/s
  windDeg: number;
  windCompass: string;
  windGust: number | null;
  rain1h: number | null;
  snow1h: number | null;
  sunrise: string;
  sunset: string;
}

export type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: WeatherData }
  | { status: 'error'; message: string };
