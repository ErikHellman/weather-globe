export interface OWMWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OWMCurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: OWMWeatherCondition[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: { all: number };
  rain?: { '1h': number };
  snow?: { '1h': number };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

/** Display-ready weather data for the panel (all metric). */
export interface WeatherData {
  locationLabel: string;
  condition: string;
  iconUrl: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  clouds: number;
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
