import type { EasingOptions } from 'mapbox-gl';
import { SEARCH_ZOOM_LEVEL } from '../config/mapConfig';
import type { SearchResultFeature } from '../types/map';
import { buildFlyToOptions } from './flyToOptions';

/**
 * Builds flyTo options from a geocoding search result feature.
 * Extracts [lng, lat] from the GeoJSON geometry and delegates to buildFlyToOptions.
 */
export function buildSearchFlyToOptions(feature: SearchResultFeature): EasingOptions {
  const [lng, lat] = feature.geometry.coordinates;
  return buildFlyToOptions(lng, lat, SEARCH_ZOOM_LEVEL);
}
