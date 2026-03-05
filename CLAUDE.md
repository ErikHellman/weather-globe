# Weather Globe

React + Vite + MapBox GL JS v3 globe SPA. Click the globe → fly to that location.

## Commands

```bash
npm run dev            # Start dev server (needs VITE_MAPBOX_TOKEN in .env)
npm test               # Run unit tests (no .env needed — token hardcoded in vite.config.ts)
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier write
npm run format:check   # Prettier check (CI)
npm run build          # tsc -b (type-check) then vite build
npm run test:coverage  # Generate coverage report
```

## Environment

Copy `.env.example` to `.env` and add a real MapBox token. The dev server will fail silently (blank canvas) without it. Tests use a hardcoded dummy token and never need `.env`.

## Architecture

Code flows strictly through four layers — do not skip layers or add side effects to `lib/`:

```
config/ → lib/ → hooks/ → components/
```

| Layer | File | Rule |
|---|---|---|
| Config | `src/config/mapConfig.ts` | Single source of truth for all constants |
| Lib | `src/lib/*.ts` | Pure functions only — no MapBox imports, no side effects |
| Hook | `src/hooks/useMapbox.ts` | Only impure layer; owns map lifecycle and cleanup |
| Component | `src/components/GlobeMap/` | Renders `<div>` container + calls hook; no logic |

## MapBox GL JS v3 Gotchas

- **`EasingOptions`**, not `FlyToOptions` — v3 renamed it; `FlyToOptions` doesn't exist
- **`import { Map as MapboxMap }`** — alias required to avoid collision with the DOM `Map` type
- **`map.on('style.load', ...)`** for `setFog` — `'load'` fires too late; fog must be set after the style JSON parses, not after all tiles load
- **`import 'mapbox-gl/dist/mapbox-gl.css'`** in `useMapbox.ts` is a mandatory side-effect import; omitting it renders a blank white canvas

## Testing

MapBox GL JS requires WebGL + Web Workers — it cannot run in JSDOM. Never instantiate a real `mapboxgl.Map` in a test.

| What you're testing | Mock needed | Where |
|---|---|---|
| `src/lib/` functions | None — pure functions | `src/__tests__/lib/` |
| `src/hooks/useMapbox.ts` | `vi.mock('mapbox-gl')` | Resolves to `__mocks__/mapbox-gl.ts` at project root |
| `src/components/GlobeMap/` | `vi.mock('mapbox-gl')` | Same |

Import named spies from the mock file to assert on method calls:
```ts
import { mockOn, mockOff, mockRemove } from '../../../__mocks__/mapbox-gl';
```

## Non-Obvious Setup Details

- `vite.config.ts` uses `import { defineConfig } from 'vitest/config'` (not `'vite'`) — this is what gives the `test` config block its TypeScript types
- `tsconfig.app.json` targets ES2022 (browser); `tsconfig.node.json` targets ES2023 (build tools)
- ESLint flat config: `eslint-config-prettier` **must be last** in the array to override lint rules that conflict with Prettier
- `GlobeMap.css` uses `position: absolute` — the parent (`#root`) must have `position: relative` and defined dimensions; this is set in `index.html`
