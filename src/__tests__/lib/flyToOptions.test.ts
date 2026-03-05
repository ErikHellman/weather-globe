import { describe, it, expect } from 'vitest';
import { buildFlyToOptions } from '../../lib/flyToOptions';
import { CLICK_ZOOM_LEVEL } from '../../config/mapConfig';

describe('buildFlyToOptions', () => {
  it('returns center as [lng, lat] tuple', () => {
    const result = buildFlyToOptions(10, 20);
    expect(result.center).toEqual([10, 20]);
  });

  it('uses CLICK_ZOOM_LEVEL as default zoom', () => {
    const result = buildFlyToOptions(0, 0);
    expect(result.zoom).toBe(CLICK_ZOOM_LEVEL);
  });

  it('accepts an explicit zoom override', () => {
    const result = buildFlyToOptions(0, 0, 12);
    expect(result.zoom).toBe(12);
  });

  it('sets essential: true', () => {
    const result = buildFlyToOptions(0, 0);
    expect(result.essential).toBe(true);
  });

  it('handles negative coordinates (southern/western hemisphere)', () => {
    const result = buildFlyToOptions(-73.9857, -33.8688);
    expect(result.center).toEqual([-73.9857, -33.8688]);
  });

  it('handles boundary coordinates (poles and date line)', () => {
    expect(buildFlyToOptions(180, 90).center).toEqual([180, 90]);
    expect(buildFlyToOptions(-180, -90).center).toEqual([-180, -90]);
  });

  it('handles zero coordinates', () => {
    const result = buildFlyToOptions(0, 0);
    expect(result.center).toEqual([0, 0]);
  });
});
