import { useCallback, useEffect, useRef, type RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { buildMapOptions } from '../lib/mapInit';
import { createClickHandler } from '../lib/mapEvents';
import { buildSearchFlyToOptions } from '../lib/searchResult';
import { FOG_CONFIG } from '../config/mapConfig';
import type { MapClickCoords, SearchResultFeature } from '../types/map';

/**
 * Initializes a MapBox GL map inside the given container ref.
 * Registers click-to-zoom behavior and atmosphere fog.
 * Cleans up the map instance on unmount.
 *
 * Returns handleSearchResult, which flies the map to a geocoding result.
 */
export function useMapbox(
  containerRef: RefObject<HTMLDivElement | null>,
  accessToken: string,
  onLocationSelect?: (coords: MapClickCoords) => void,
): { handleSearchResult: (feature: SearchResultFeature) => void } {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new mapboxgl.Map(buildMapOptions(container, accessToken));
    mapRef.current = map;

    map.on('style.load', () => {
      map.setFog(FOG_CONFIG);
    });

    const clickHandler = createClickHandler(map, onLocationSelect);
    map.on('click', clickHandler);

    return () => {
      map.off('click', clickHandler);
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef, accessToken, onLocationSelect]);

  const handleSearchResult = useCallback((feature: SearchResultFeature) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo(buildSearchFlyToOptions(feature));
  }, []);

  return { handleSearchResult };
}
