import { useRef } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import { useMapbox } from '../../hooks/useMapbox';
import type { GlobeMapProps } from '../../types/map';
import './GlobeMap.css';

export function GlobeMap({ accessToken, onLocationSelect }: GlobeMapProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const token = accessToken ?? import.meta.env.VITE_MAPBOX_TOKEN ?? '';
  const { handleSearchResult } = useMapbox(containerRef, token, onLocationSelect);

  return (
    <>
      <div ref={containerRef} className="globe-map-container" />
      <div className="globe-search-overlay">
        <Geocoder
          accessToken={token}
          onRetrieve={handleSearchResult}
          placeholder="Search for a place…"
        />
      </div>
    </>
  );
}
