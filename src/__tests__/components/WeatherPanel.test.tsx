import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherPanel } from '../../components/WeatherPanel/WeatherPanel';
import type { WeatherData, WeatherState } from '../../types/weather';

const MOCK_DATA: WeatherData = {
  locationLabel: '51.5074, -0.1278',
  condition: 'few clouds',
  iconUrl: 'https://openweathermap.org/img/wn/02d@2x.png',
  temp: 12.5,
  feelsLike: 10.1,
  humidity: 78,
  pressure: 1013,
  clouds: 40,
  visibility: 9.5,
  windSpeed: 5.2,
  windDeg: 220,
  windCompass: 'SW',
  windGust: 8.0,
  rain1h: 0.3,
  snow1h: null,
  sunrise: '07:30',
  sunset: '16:45',
};

function renderPanel(state: WeatherState) {
  return render(<WeatherPanel state={state} />);
}

describe('WeatherPanel — idle state', () => {
  it('renders the prompt text', () => {
    renderPanel({ status: 'idle' });
    expect(screen.getByText(/click anywhere on the globe/i)).toBeInTheDocument();
  });
});

describe('WeatherPanel — loading state', () => {
  it('renders the loading status element', () => {
    renderPanel({ status: 'loading' });
    expect(screen.getByRole('status', { name: /loading weather/i })).toBeInTheDocument();
  });

  it('renders loading text', () => {
    renderPanel({ status: 'loading' });
    expect(screen.getByText(/fetching weather/i)).toBeInTheDocument();
  });
});

describe('WeatherPanel — error state', () => {
  it('renders an alert role element', () => {
    renderPanel({ status: 'error', message: 'API error: 401 Unauthorized' });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays the error message', () => {
    renderPanel({ status: 'error', message: 'API error: 401 Unauthorized' });
    expect(screen.getByText('API error: 401 Unauthorized')).toBeInTheDocument();
  });
});

describe('WeatherPanel — success state', () => {
  it('renders the location label', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('51.5074, -0.1278')).toBeInTheDocument();
  });

  it('renders the condition text', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('few clouds')).toBeInTheDocument();
  });

  it('renders the condition icon with correct src and alt', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    const img = screen.getByRole('img', { name: 'few clouds' });
    expect(img).toHaveAttribute('src', MOCK_DATA.iconUrl);
    expect(img).toHaveAttribute('alt', 'few clouds');
  });

  it('renders temperature', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('12.5 °C')).toBeInTheDocument();
  });

  it('renders feels like', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('10.1 °C')).toBeInTheDocument();
  });

  it('renders humidity', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('78 %')).toBeInTheDocument();
  });

  it('renders pressure', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('1013 hPa')).toBeInTheDocument();
  });

  it('renders visibility in km', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('9.5 km')).toBeInTheDocument();
  });

  it('renders wind with compass and degrees', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText(/5\.2 m\/s SW \(220°\)/)).toBeInTheDocument();
  });

  it('renders wind gust when present', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('8.0 m/s')).toBeInTheDocument();
  });

  it('does not render wind gust row when windGust is null', () => {
    renderPanel({
      status: 'success',
      data: { ...MOCK_DATA, windGust: null },
    });
    expect(screen.queryByText(/wind gust/i)).not.toBeInTheDocument();
  });

  it('renders rain row when rain1h is present', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('0.3 mm/h')).toBeInTheDocument();
  });

  it('does not render rain row when rain1h is null', () => {
    renderPanel({
      status: 'success',
      data: { ...MOCK_DATA, rain1h: null },
    });
    expect(screen.queryByText(/rain \(1 h\)/i)).not.toBeInTheDocument();
  });

  it('renders snow row when snow1h is present', () => {
    renderPanel({
      status: 'success',
      data: { ...MOCK_DATA, snow1h: 1.5 },
    });
    expect(screen.getByText('1.5 mm/h')).toBeInTheDocument();
  });

  it('does not render snow row when snow1h is null', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.queryByText(/snow \(1 h\)/i)).not.toBeInTheDocument();
  });

  it('renders sunrise', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('07:30 (local)')).toBeInTheDocument();
  });

  it('renders sunset', () => {
    renderPanel({ status: 'success', data: MOCK_DATA });
    expect(screen.getByText('16:45 (local)')).toBeInTheDocument();
  });
});

describe('WeatherPanel — accessibility', () => {
  it('has aria-live="polite" on the panel', () => {
    const { container } = renderPanel({ status: 'idle' });
    expect(container.querySelector('.weather-panel')).toHaveAttribute('aria-live', 'polite');
  });

  it('has aria-atomic="true" on the panel', () => {
    const { container } = renderPanel({ status: 'idle' });
    expect(container.querySelector('.weather-panel')).toHaveAttribute('aria-atomic', 'true');
  });
});
