import { describe, it, expect } from 'vitest';
import {
  degreesToCompass,
  formatUnixToLocalTime,
  metersToKm,
  buildIconUrl,
  buildWeatherUrl,
  transformWeatherResponse,
} from '../../lib/weatherTransforms';
import type { OWMCurrentWeatherResponse } from '../../types/weather';

// ---------------------------------------------------------------------------
// degreesToCompass
// ---------------------------------------------------------------------------
describe('degreesToCompass', () => {
  it('returns N for 0°', () => expect(degreesToCompass(0)).toBe('N'));
  it('returns N for 360°', () => expect(degreesToCompass(360)).toBe('N'));
  it('returns NNE for 22.5°', () => expect(degreesToCompass(22.5)).toBe('NNE'));
  it('returns NE for 45°', () => expect(degreesToCompass(45)).toBe('NE'));
  it('returns ENE for 67.5°', () => expect(degreesToCompass(67.5)).toBe('ENE'));
  it('returns E for 90°', () => expect(degreesToCompass(90)).toBe('E'));
  it('returns S for 180°', () => expect(degreesToCompass(180)).toBe('S'));
  it('returns W for 270°', () => expect(degreesToCompass(270)).toBe('W'));
  it('returns NNW for 337.5°', () => expect(degreesToCompass(337.5)).toBe('NNW'));
  it('handles negative degrees (wraps correctly)', () => {
    // -90° should be W (270°)
    expect(degreesToCompass(-90)).toBe('W');
  });
  it('handles degrees > 360', () => {
    // 450° = 90° = E
    expect(degreesToCompass(450)).toBe('E');
  });
  it('rounds to the nearest point', () => {
    // 11° rounds to 0 (N) rather than 22.5 (NNE) boundary
    expect(degreesToCompass(11)).toBe('N');
  });
});

// ---------------------------------------------------------------------------
// formatUnixToLocalTime
// ---------------------------------------------------------------------------
describe('formatUnixToLocalTime', () => {
  it('formats midnight UTC with zero offset', () => {
    const midnight = 0; // 1970-01-01 00:00:00 UTC
    expect(formatUnixToLocalTime(midnight, 0)).toBe('00:00');
  });

  it('applies positive timezone offset', () => {
    // 23:00 UTC + 3600s offset = 00:00 next hour (01:00 local)
    const time23 = 23 * 3600; // 23:00 UTC
    expect(formatUnixToLocalTime(time23, 3600)).toBe('00:00');
  });

  it('applies negative timezone offset', () => {
    // 01:00 UTC - 3600s offset = 00:00 local
    const time01 = 1 * 3600; // 01:00 UTC
    expect(formatUnixToLocalTime(time01, -3600)).toBe('00:00');
  });

  it('pads single-digit hours and minutes with zero', () => {
    // 09:05 UTC
    const time = 9 * 3600 + 5 * 60;
    expect(formatUnixToLocalTime(time, 0)).toBe('09:05');
  });

  it('handles large offset (UTC+5:30)', () => {
    // 18:30 UTC + 19800s (5h30m) = 00:00 next day local
    const time = 18 * 3600 + 30 * 60;
    expect(formatUnixToLocalTime(time, 5 * 3600 + 30 * 60)).toBe('00:00');
  });
});

// ---------------------------------------------------------------------------
// metersToKm
// ---------------------------------------------------------------------------
describe('metersToKm', () => {
  it('converts 10000m to 10.0km', () => expect(metersToKm(10000)).toBe(10));
  it('converts 1000m to 1.0km', () => expect(metersToKm(1000)).toBe(1));
  it('converts 500m to 0.5km', () => expect(metersToKm(500)).toBe(0.5));
  it('converts 9500m to 9.5km', () => expect(metersToKm(9500)).toBe(9.5));
  it('converts 0m to 0km', () => expect(metersToKm(0)).toBe(0));
  it('rounds to one decimal: 1250m → 1.3km', () => expect(metersToKm(1250)).toBe(1.3));
  it('rounds to one decimal: 1240m → 1.2km', () => expect(metersToKm(1240)).toBe(1.2));
});

// ---------------------------------------------------------------------------
// buildIconUrl
// ---------------------------------------------------------------------------
describe('buildIconUrl', () => {
  it('returns OWM @2x icon URL', () => {
    expect(buildIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@2x.png');
  });

  it('works with night icons', () => {
    expect(buildIconUrl('13n')).toBe('https://openweathermap.org/img/wn/13n@2x.png');
  });
});

// ---------------------------------------------------------------------------
// buildWeatherUrl
// ---------------------------------------------------------------------------
describe('buildWeatherUrl', () => {
  const BASE = 'https://api.openweathermap.org/data/2.5/weather';

  it('starts with the given base URL', () => {
    const url = buildWeatherUrl(51.5, -0.1, 'mykey', BASE);
    expect(url.startsWith(BASE + '?')).toBe(true);
  });

  it('includes lat and lon params', () => {
    const url = buildWeatherUrl(51.5, -0.1, 'mykey', BASE);
    expect(url).toContain('lat=51.5');
    expect(url).toContain('lon=-0.1');
  });

  it('sets units=metric', () => {
    const url = buildWeatherUrl(0, 0, 'key', BASE);
    expect(url).toContain('units=metric');
  });

  it('does not include exclude param', () => {
    const url = buildWeatherUrl(0, 0, 'key', BASE);
    expect(url).not.toContain('exclude=');
  });

  it('includes the api key', () => {
    const url = buildWeatherUrl(0, 0, 'supersecretkey', BASE);
    expect(url).toContain('appid=supersecretkey');
  });

  it('supports a custom base URL', () => {
    const url = buildWeatherUrl(0, 0, 'key', 'https://example.com/weather');
    expect(url.startsWith('https://example.com/weather?')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// transformWeatherResponse
// ---------------------------------------------------------------------------

const MOCK_RESPONSE: OWMCurrentWeatherResponse = {
  coord: { lon: -0.1278, lat: 51.5074 },
  weather: [
    {
      id: 801,
      main: 'Clouds',
      description: 'few clouds',
      icon: '02d',
    },
  ],
  base: 'stations',
  main: {
    temp: 12.5,
    feels_like: 10.1,
    temp_min: 11.0,
    temp_max: 14.0,
    pressure: 1013,
    humidity: 78,
  },
  visibility: 9500,
  wind: {
    speed: 5.2,
    deg: 220,
    gust: 8.0,
  },
  clouds: { all: 40 },
  rain: { '1h': 0.5 },
  dt: 1700000000,
  sys: {
    type: 2,
    id: 2075535,
    country: 'GB',
    sunrise: 1699999000,
    sunset: 1700020000,
  },
  timezone: 3600,
  id: 2643743,
  name: 'London',
  cod: 200,
};

describe('transformWeatherResponse', () => {
  const result = transformWeatherResponse(MOCK_RESPONSE, 51.5074, -0.1278);

  it('builds the location label from lat/lng', () => {
    expect(result.locationLabel).toBe('51.5074, -0.1278');
  });

  it('sets condition from weather description', () => {
    expect(result.condition).toBe('few clouds');
  });

  it('builds icon URL from weather icon code', () => {
    expect(result.iconUrl).toBe('https://openweathermap.org/img/wn/02d@2x.png');
  });

  it('passes through temp', () => expect(result.temp).toBe(12.5));
  it('passes through feelsLike', () => expect(result.feelsLike).toBe(10.1));
  it('passes through humidity', () => expect(result.humidity).toBe(78));
  it('passes through pressure', () => expect(result.pressure).toBe(1013));
  it('passes through clouds', () => expect(result.clouds).toBe(40));

  it('converts visibility from meters to km', () => {
    expect(result.visibility).toBe(metersToKm(9500));
  });

  it('passes through windSpeed', () => expect(result.windSpeed).toBe(5.2));
  it('passes through windDeg', () => expect(result.windDeg).toBe(220));

  it('converts windDeg to compass direction', () => {
    expect(result.windCompass).toBe(degreesToCompass(220));
  });

  it('includes windGust when present', () => expect(result.windGust).toBe(8.0));
  it('includes rain1h when present', () => expect(result.rain1h).toBe(0.5));

  it('formats sunrise using timezone offset', () => {
    const expected = formatUnixToLocalTime(MOCK_RESPONSE.sys.sunrise, 3600);
    expect(result.sunrise).toBe(expected);
  });

  it('formats sunset using timezone offset', () => {
    const expected = formatUnixToLocalTime(MOCK_RESPONSE.sys.sunset, 3600);
    expect(result.sunset).toBe(expected);
  });

  it('sets windGust to null when absent', () => {
    const noGust: OWMCurrentWeatherResponse = {
      ...MOCK_RESPONSE,
      wind: { speed: 5.2, deg: 220 },
    };
    expect(transformWeatherResponse(noGust, 0, 0).windGust).toBeNull();
  });

  it('sets rain1h to null when absent', () => {
    const noRain: OWMCurrentWeatherResponse = {
      ...MOCK_RESPONSE,
      rain: undefined,
    };
    expect(transformWeatherResponse(noRain, 0, 0).rain1h).toBeNull();
  });

  it('sets snow1h to null when absent', () => {
    expect(result.snow1h).toBeNull();
  });

  it('includes snow1h when present', () => {
    const withSnow: OWMCurrentWeatherResponse = {
      ...MOCK_RESPONSE,
      snow: { '1h': 1.2 },
    };
    expect(transformWeatherResponse(withSnow, 0, 0).snow1h).toBe(1.2);
  });

  it('uses fallback icon when weather array is empty', () => {
    const noWeather: OWMCurrentWeatherResponse = {
      ...MOCK_RESPONSE,
      weather: [],
    };
    const r = transformWeatherResponse(noWeather, 0, 0);
    expect(r.iconUrl).toBe('https://openweathermap.org/img/wn/01d@2x.png');
    expect(r.condition).toBe('unknown');
  });
});
