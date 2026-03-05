import type { MapboxOptions } from 'mapbox-gl';
import { MAP_STYLE, INITIAL_CENTER, INITIAL_ZOOM, MIN_ZOOM, MAX_ZOOM } from '../config/mapConfig';

/**
 * Builds the options object for initializing a new mapboxgl.Map instance.
 * Kept as a pure function so initialization options can be tested independently
 * of the MapBox GL JS library itself.
 */
export function buildMapOptions(container: HTMLElement, accessToken: string): MapboxOptions {
  return {
    container,
    style: MAP_STYLE,
    projection: 'globe',
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    accessToken,
  };
}
