import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('mapbox-gl');
vi.mock('@mapbox/search-js-react', () => ({
  Geocoder: vi.fn(() => null),
}));

import { Geocoder } from '@mapbox/search-js-react';
import { GlobeMap } from '../../components/GlobeMap/GlobeMap';

describe('GlobeMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a container div with the expected class', () => {
    const { container } = render(<GlobeMap accessToken="test-token" />);
    expect(container.querySelector('.globe-map-container')).toBeInTheDocument();
  });

  it('renders without crashing when given an access token', () => {
    expect(() => render(<GlobeMap accessToken="pk.test" />)).not.toThrow();
  });

  it('renders without crashing when no access token is provided', () => {
    expect(() => render(<GlobeMap />)).not.toThrow();
  });

  it('renders a Geocoder with the access token', () => {
    render(<GlobeMap accessToken="pk.test" />);
    const props = vi.mocked(Geocoder).mock.calls[0][0];
    expect(props.accessToken).toBe('pk.test');
  });

  it('passes an onRetrieve handler to Geocoder', () => {
    render(<GlobeMap accessToken="pk.test" />);
    const props = vi.mocked(Geocoder).mock.calls[0][0];
    expect(typeof props.onRetrieve).toBe('function');
  });
});
