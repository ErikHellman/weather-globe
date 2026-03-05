# Weather Globe

An interactive 3D Earth globe built with React, Vite, and MapBox GL JS. Click or tap anywhere on the globe to fly to that location.

## Prerequisites

- Node.js 18+
- A [MapBox access token](https://account.mapbox.com/access-tokens/)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Add your MapBox token to `.env`:
   ```
   VITE_MAPBOX_TOKEN=pk.your_token_here
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Check formatting without writing |

## Project Structure

```
src/
├── config/
│   └── mapConfig.ts          # Map constants: style, zoom levels, fog settings
├── lib/
│   ├── flyToOptions.ts       # Pure function: builds flyTo animation options
│   ├── mapInit.ts            # Pure function: builds Map initialization options
│   └── mapEvents.ts          # Factory: creates the click-to-zoom event handler
├── hooks/
│   └── useMapbox.ts          # Custom hook: manages the MapBox map lifecycle
├── components/
│   └── GlobeMap/
│       ├── GlobeMap.tsx      # React component: renders the map container
│       └── GlobeMap.css      # Full-viewport styles
├── types/
│   └── map.ts                # Shared TypeScript interfaces
└── __tests__/                # Unit tests mirroring the src/ structure
__mocks__/
└── mapbox-gl.ts              # Manual Vitest mock for MapBox GL JS
```

## Architecture

The app is split into testable layers:

- **Config** (`mapConfig.ts`) — all tunable values in one place
- **Pure functions** (`lib/`) — compute options objects with no side effects; tested without mocking
- **Hook** (`useMapbox.ts`) — the only impure layer; owns map creation, event wiring, and cleanup
- **Component** (`GlobeMap.tsx`) — thin wrapper that passes a `ref` to the hook and renders the container `div`

MapBox GL JS requires WebGL and Web Workers, so it cannot run in a test environment (JSDOM). The manual mock at `__mocks__/mapbox-gl.ts` replaces it with `vi.fn()` spies so the hook and component logic can be verified without a real browser.

## Tech Stack

- [React 19](https://react.dev)
- [Vite 7](https://vite.dev)
- [MapBox GL JS v3](https://docs.mapbox.com/mapbox-gl-js/)
- [TypeScript 5](https://www.typescriptlang.org)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io)
