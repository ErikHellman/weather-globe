import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('mapbox-gl');

import { mockFlyTo, mockOn, mockOff, mockRemove } from '../../../__mocks__/mapbox-gl';
import { useMapbox } from '../../hooks/useMapbox';
import { SEARCH_ZOOM_LEVEL } from '../../config/mapConfig';

describe('useMapbox', () => {
  const container = document.createElement('div');
  const containerRef = { current: container };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers the style.load event listener', () => {
    renderHook(() => useMapbox(containerRef, 'token'));
    expect(mockOn).toHaveBeenCalledWith('style.load', expect.any(Function));
  });

  it('registers a click event listener', () => {
    renderHook(() => useMapbox(containerRef, 'token'));
    expect(mockOn).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('calls map.remove() on unmount', () => {
    const { unmount } = renderHook(() => useMapbox(containerRef, 'token'));
    unmount();
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });

  it('removes the click handler on unmount', () => {
    const { unmount } = renderHook(() => useMapbox(containerRef, 'token'));
    unmount();
    expect(mockOff).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('passes onLocationSelect to createClickHandler (click handler registered)', () => {
    const onSelect = vi.fn();
    renderHook(() => useMapbox(containerRef, 'token', onSelect));
    // The click handler registered via mockOn should ultimately call onSelect.
    // We verify that a click handler was registered (the hook wired up the callback).
    expect(mockOn).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('does not initialize when containerRef.current is null', () => {
    const nullRef = { current: null };
    renderHook(() => useMapbox(nullRef, 'token'));
    expect(mockOn).not.toHaveBeenCalled();
    expect(mockRemove).not.toHaveBeenCalled();
  });

  describe('handleSearchResult', () => {
    it('calls map.flyTo with coordinates from the search feature', () => {
      const { result } = renderHook(() => useMapbox(containerRef, 'token'));
      const feature = { geometry: { coordinates: [13.405, 52.52] } };
      act(() => {
        result.current.handleSearchResult(feature);
      });
      expect(mockFlyTo).toHaveBeenCalledWith(
        expect.objectContaining({ center: [13.405, 52.52], zoom: SEARCH_ZOOM_LEVEL })
      );
    });

    it('does not throw and does not call flyTo when map is not initialized', () => {
      const nullRef = { current: null };
      const { result } = renderHook(() => useMapbox(nullRef, 'token'));
      const feature = { geometry: { coordinates: [0, 0] } };
      expect(() => {
        act(() => {
          result.current.handleSearchResult(feature);
        });
      }).not.toThrow();
      expect(mockFlyTo).not.toHaveBeenCalled();
    });
  });
});
