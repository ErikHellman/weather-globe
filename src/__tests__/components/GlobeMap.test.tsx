import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('mapbox-gl');

import { GlobeMap } from '../../components/GlobeMap/GlobeMap';

describe('GlobeMap', () => {
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
});
