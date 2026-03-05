import { useRef } from 'react';
import { useMapbox } from '../../hooks/useMapbox';
import type { GlobeMapProps } from '../../types/map';
import './GlobeMap.css';

export function GlobeMap({ accessToken }: GlobeMapProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const token = accessToken ?? import.meta.env.VITE_MAPBOX_TOKEN ?? '';

  useMapbox(containerRef, token);

  return <div ref={containerRef} className="globe-map-container" />;
}
