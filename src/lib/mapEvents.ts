import type { MapMouseEvent, Map as MapboxMap } from 'mapbox-gl';
import { buildFlyToOptions } from './flyToOptions';

/**
 * Returns a click handler that animates the map to the clicked location.
 * The factory pattern keeps the handler testable: tests can pass a mock map,
 * invoke the returned function, and assert on flyTo calls without any DOM/WebGL.
 */
export function createClickHandler(map: MapboxMap): (event: MapMouseEvent) => void {
  return (event: MapMouseEvent): void => {
    const { lng, lat } = event.lngLat;
    map.flyTo(buildFlyToOptions(lng, lat));
  };
}
