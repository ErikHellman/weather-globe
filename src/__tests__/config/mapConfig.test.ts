import { describe, it, expect } from 'vitest';
import {
  MAP_STYLE,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  CLICK_ZOOM_LEVEL,
  FOG_CONFIG,
  MIN_ZOOM,
  MAX_ZOOM,
} from '../../config/mapConfig';

describe('mapConfig', () => {
  it('MAP_STYLE is a valid mapbox:// URL', () => {
    expect(MAP_STYLE).toMatch(/^mapbox:\/\//);
  });

  it('INITIAL_CENTER is a [lng, lat] tuple within valid ranges', () => {
    const [lng, lat] = INITIAL_CENTER;
    expect(lng).toBeGreaterThanOrEqual(-180);
    expect(lng).toBeLessThanOrEqual(180);
    expect(lat).toBeGreaterThanOrEqual(-90);
    expect(lat).toBeLessThanOrEqual(90);
  });

  it('INITIAL_ZOOM is within min/max bounds', () => {
    expect(INITIAL_ZOOM).toBeGreaterThanOrEqual(MIN_ZOOM);
    expect(INITIAL_ZOOM).toBeLessThanOrEqual(MAX_ZOOM);
  });

  it('CLICK_ZOOM_LEVEL is higher than INITIAL_ZOOM (zooms in on click)', () => {
    expect(CLICK_ZOOM_LEVEL).toBeGreaterThan(INITIAL_ZOOM);
  });

  it('MIN_ZOOM is less than MAX_ZOOM', () => {
    expect(MIN_ZOOM).toBeLessThan(MAX_ZOOM);
  });

  it('FOG_CONFIG has required color properties', () => {
    expect(FOG_CONFIG).toHaveProperty('color');
    expect(FOG_CONFIG).toHaveProperty('high-color');
    expect(FOG_CONFIG).toHaveProperty('space-color');
  });

  it('FOG_CONFIG star-intensity is between 0 and 1', () => {
    expect(FOG_CONFIG['star-intensity']).toBeGreaterThanOrEqual(0);
    expect(FOG_CONFIG['star-intensity']).toBeLessThanOrEqual(1);
  });

  it('FOG_CONFIG horizon-blend is between 0 and 1', () => {
    expect(FOG_CONFIG['horizon-blend']).toBeGreaterThanOrEqual(0);
    expect(FOG_CONFIG['horizon-blend']).toBeLessThanOrEqual(1);
  });
});
