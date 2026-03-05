import { describe, it, expect } from 'vitest';
import { buildSearchFlyToOptions } from '../../lib/searchResult';
import { SEARCH_ZOOM_LEVEL } from '../../config/mapConfig';

describe('buildSearchFlyToOptions', () => {
  it('extracts lng from geometry coordinates[0]', () => {
    const feature = { geometry: { coordinates: [13.405, 52.52] } };
    const result = buildSearchFlyToOptions(feature);
    expect((result.center as [number, number])[0]).toBe(13.405);
  });

  it('extracts lat from geometry coordinates[1]', () => {
    const feature = { geometry: { coordinates: [13.405, 52.52] } };
    const result = buildSearchFlyToOptions(feature);
    expect((result.center as [number, number])[1]).toBe(52.52);
  });

  it('uses SEARCH_ZOOM_LEVEL as the zoom', () => {
    const feature = { geometry: { coordinates: [0, 0] } };
    const result = buildSearchFlyToOptions(feature);
    expect(result.zoom).toBe(SEARCH_ZOOM_LEVEL);
  });

  it('sets essential: true', () => {
    const feature = { geometry: { coordinates: [0, 0] } };
    const result = buildSearchFlyToOptions(feature);
    expect(result.essential).toBe(true);
  });

  it('handles negative coordinates (southern/western hemisphere)', () => {
    const feature = { geometry: { coordinates: [-73.9857, -33.8688] } };
    const result = buildSearchFlyToOptions(feature);
    expect(result.center).toEqual([-73.9857, -33.8688]);
  });

  it('handles boundary coordinates (poles and date line)', () => {
    const feature = { geometry: { coordinates: [180, 90] } };
    expect(buildSearchFlyToOptions(feature).center).toEqual([180, 90]);
  });
});
