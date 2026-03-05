import { useEffect, type RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { buildMapOptions } from '../lib/mapInit';
import { createClickHandler } from '../lib/mapEvents';
import { FOG_CONFIG } from '../config/mapConfig';

/**
 * Initializes a MapBox GL map inside the given container ref.
 * Registers click-to-zoom behavior and atmosphere fog.
 * Cleans up the map instance on unmount.
 */
export function useMapbox(
  containerRef: RefObject<HTMLDivElement | null>,
  accessToken: string
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new mapboxgl.Map(buildMapOptions(container, accessToken));

    map.on('style.load', () => {
      map.setFog(FOG_CONFIG);
    });

    const clickHandler = createClickHandler(map);
    map.on('click', clickHandler);

    return () => {
      map.off('click', clickHandler);
      map.remove();
    };
  }, [containerRef, accessToken]);
}
