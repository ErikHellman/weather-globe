import type { WeatherState } from '../../types/weather';
import './WeatherPanel.css';

interface WeatherPanelProps {
  state: WeatherState;
}

export function WeatherPanel({ state }: WeatherPanelProps): React.JSX.Element {
  return (
    <div className="weather-panel" aria-live="polite" aria-atomic="true">
      {state.status === 'idle' && (
        <p className="weather-panel__prompt">Click anywhere on the globe to see weather.</p>
      )}
      {state.status === 'loading' && (
        <div className="weather-panel__loading" role="status" aria-label="Loading weather">
          <span className="weather-panel__spinner" aria-hidden="true" />
          <p>Fetching weather…</p>
        </div>
      )}
      {state.status === 'error' && (
        <div className="weather-panel__error" role="alert">
          <p>Could not load weather.</p>
          <p className="weather-panel__error-detail">{state.message}</p>
        </div>
      )}
      {state.status === 'success' && (
        <div className="weather-panel__data">
          <h2 className="weather-panel__location">{state.data.locationLabel}</h2>
          <div className="weather-panel__condition">
            <img
              src={state.data.iconUrl}
              alt={state.data.condition}
              className="weather-panel__icon"
              width={50}
              height={50}
            />
            <span className="weather-panel__condition-text">{state.data.condition}</span>
          </div>
          <dl className="weather-panel__fields">
            <dt>Temperature</dt>
            <dd>{state.data.temp.toFixed(1)} °C</dd>
            <dt>Feels like</dt>
            <dd>{state.data.feelsLike.toFixed(1)} °C</dd>
            <dt>Dew point</dt>
            <dd>{state.data.dewPoint.toFixed(1)} °C</dd>
            <dt>Humidity</dt>
            <dd>{state.data.humidity} %</dd>
            <dt>Pressure</dt>
            <dd>{state.data.pressure} hPa</dd>
            <dt>Cloud cover</dt>
            <dd>{state.data.clouds} %</dd>
            <dt>UV index</dt>
            <dd>{state.data.uvIndex.toFixed(1)}</dd>
            <dt>Visibility</dt>
            <dd>{state.data.visibility.toFixed(1)} km</dd>
            <dt>Wind</dt>
            <dd>
              {state.data.windSpeed.toFixed(1)} m/s {state.data.windCompass} ({state.data.windDeg}°)
            </dd>
            {state.data.windGust !== null && (
              <>
                <dt>Wind gust</dt>
                <dd>{state.data.windGust.toFixed(1)} m/s</dd>
              </>
            )}
            {state.data.rain1h !== null && (
              <>
                <dt>Rain (1 h)</dt>
                <dd>{state.data.rain1h.toFixed(1)} mm/h</dd>
              </>
            )}
            {state.data.snow1h !== null && (
              <>
                <dt>Snow (1 h)</dt>
                <dd>{state.data.snow1h.toFixed(1)} mm/h</dd>
              </>
            )}
            <dt>Sunrise</dt>
            <dd>{state.data.sunrise} (local)</dd>
            <dt>Sunset</dt>
            <dd>{state.data.sunset} (local)</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
