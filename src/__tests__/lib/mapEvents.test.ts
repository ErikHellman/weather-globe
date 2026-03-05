import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClickHandler } from '../../lib/mapEvents';
import { CLICK_ZOOM_LEVEL } from '../../config/mapConfig';
import type { MapMouseEvent, Map as MapboxMap } from 'mapbox-gl';

describe('createClickHandler', () => {
  const mockFlyTo = vi.fn();
  const mockMap = { flyTo: mockFlyTo } as unknown as MapboxMap;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeEvent(lng: number, lat: number): MapMouseEvent {
    return { lngLat: { lng, lat } } as MapMouseEvent;
  }

  it('returns a function', () => {
    expect(typeof createClickHandler(mockMap)).toBe('function');
  });

  it('calls map.flyTo when the handler is invoked', () => {
    const handler = createClickHandler(mockMap);
    handler(makeEvent(10, 20));
    expect(mockFlyTo).toHaveBeenCalledTimes(1);
  });

  it('passes the clicked lng/lat as center', () => {
    const handler = createClickHandler(mockMap);
    handler(makeEvent(10, 20));
    expect(mockFlyTo).toHaveBeenCalledWith(expect.objectContaining({ center: [10, 20] }));
  });

  it('uses CLICK_ZOOM_LEVEL as the target zoom', () => {
    const handler = createClickHandler(mockMap);
    handler(makeEvent(0, 0));
    expect(mockFlyTo).toHaveBeenCalledWith(expect.objectContaining({ zoom: CLICK_ZOOM_LEVEL }));
  });

  it('sets essential: true on the flyTo call', () => {
    const handler = createClickHandler(mockMap);
    handler(makeEvent(0, 0));
    expect(mockFlyTo).toHaveBeenCalledWith(expect.objectContaining({ essential: true }));
  });

  it('handles negative coordinates', () => {
    const handler = createClickHandler(mockMap);
    handler(makeEvent(-122.4194, 37.7749));
    expect(mockFlyTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [-122.4194, 37.7749] })
    );
  });

  it('creates independent handlers for different map instances', () => {
    const mockFlyTo2 = vi.fn();
    const mockMap2 = { flyTo: mockFlyTo2 } as unknown as MapboxMap;

    const handler1 = createClickHandler(mockMap);
    const handler2 = createClickHandler(mockMap2);

    handler1(makeEvent(1, 2));
    handler2(makeEvent(3, 4));

    expect(mockFlyTo).toHaveBeenCalledWith(expect.objectContaining({ center: [1, 2] }));
    expect(mockFlyTo2).toHaveBeenCalledWith(expect.objectContaining({ center: [3, 4] }));
  });
});
