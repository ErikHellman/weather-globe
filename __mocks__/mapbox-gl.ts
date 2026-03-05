import { vi } from 'vitest';

/** Named spies so tests can import and assert on individual methods */
export const mockFlyTo = vi.fn();
export const mockOn = vi.fn();
export const mockOff = vi.fn();
export const mockRemove = vi.fn();
export const mockSetFog = vi.fn();

class MockMap {
  flyTo = mockFlyTo;
  on = mockOn;
  off = mockOff;
  remove = mockRemove;
  setFog = mockSetFog;
}

const mapboxgl = {
  Map: MockMap,
  accessToken: '',
};

export default mapboxgl;
