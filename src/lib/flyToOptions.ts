import type { EasingOptions } from 'mapbox-gl';
import { CLICK_ZOOM_LEVEL } from '../config/mapConfig';

/**
 * Builds a FlyToOptions object for animating the map to a given location.
 * `essential: true` ensures the animation runs even with prefers-reduced-motion
 * since the user explicitly triggered the navigation.
 */
export function buildFlyToOptions(
  lng: number,
  lat: number,
  zoom: number = CLICK_ZOOM_LEVEL
): EasingOptions {
  return {
    center: [lng, lat],
    zoom,
    essential: true,
  };
}
