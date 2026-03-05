import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('mapbox-gl');

import { mockOn, mockOff, mockRemove } from '../../../__mocks__/mapbox-gl';
import { useMapbox } from '../../hooks/useMapbox';

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

  it('does not initialize when containerRef.current is null', () => {
    const nullRef = { current: null };
    renderHook(() => useMapbox(nullRef, 'token'));
    expect(mockOn).not.toHaveBeenCalled();
    expect(mockRemove).not.toHaveBeenCalled();
  });
});
