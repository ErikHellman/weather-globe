import { useState, useCallback } from 'react';
import { GlobeMap } from './components/GlobeMap/GlobeMap';
import { WeatherPanel } from './components/WeatherPanel/WeatherPanel';
import { useWeather } from './hooks/useWeather';
import type { MapClickCoords } from './types/map';

export default function App(): React.JSX.Element {
  const [selectedCoords, setSelectedCoords] = useState<MapClickCoords | null>(null);

  const handleLocationSelect = useCallback((coords: MapClickCoords) => {
    setSelectedCoords(coords);
  }, []);

  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY ?? '';
  const weatherState = useWeather(selectedCoords, apiKey);

  return (
    <>
      <GlobeMap onLocationSelect={handleLocationSelect} />
      <WeatherPanel state={weatherState} />
    </>
  );
}
