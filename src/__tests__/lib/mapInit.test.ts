import { describe, it, expect } from 'vitest';
import { buildMapOptions } from '../../lib/mapInit';
import {
  MAP_STYLE,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
} from '../../config/mapConfig';

describe('buildMapOptions', () => {
  const container = document.createElement('div');
  const token = 'pk.test_token';

  it('returns the provided container element', () => {
    const opts = buildMapOptions(container, token);
    expect(opts.container).toBe(container);
  });

  it('sets projection to globe', () => {
    const opts = buildMapOptions(container, token);
    expect(opts.projection).toBe('globe');
  });

  it('uses the MAP_STYLE constant', () => {
    const opts = buildMapOptions(container, token);
    expect(opts.style).toBe(MAP_STYLE);
  });

  it('uses the INITIAL_CENTER constant', () => {
    const opts = buildMapOptions(container, token);
    expect(opts.center).toEqual(INITIAL_CENTER);
  });

  it('uses the INITIAL_ZOOM constant', () => {
    const opts = buildMapOptions(container, token);
    expect(opts.zoom).toBe(INITIAL_ZOOM);
  });

  it('uses the MIN_ZOOM constant', () => {
    const opts = buildMapOptions(container, token);
    expect(opts.minZoom).toBe(MIN_ZOOM);
  });

  it('uses the MAX_ZOOM constant', () => {
    const opts = buildMapOptions(container, token);
    expect(opts.maxZoom).toBe(MAX_ZOOM);
  });

  it('passes the access token through', () => {
    const opts = buildMapOptions(container, 'pk.my_test_token');
    expect(opts.accessToken).toBe('pk.my_test_token');
  });
});
