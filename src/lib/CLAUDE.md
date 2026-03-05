# src/lib/

Pure utility functions for the globe interaction logic. These are the only modules in the project that can be tested with zero mocking.

## Contract

Every function here **must** be pure:
- Takes primitives or plain objects as inputs
- Returns plain objects
- No imports from `mapbox-gl` (use `mapboxgl` types only via `import type`)
- No browser APIs, no side effects, no React

If you need to call a MapBox method or touch the DOM, the code belongs in `src/hooks/useMapbox.ts` instead.

## Why This Separation Matters

`lib/` tests exercise business logic (zoom levels, center coordinates, option shapes) with simple `expect(fn(args)).toEqual(...)` assertions — no `vi.mock`, no `renderHook`, no async. Keeping map initialization logic here means configuration bugs are caught cheaply before any browser integration.
