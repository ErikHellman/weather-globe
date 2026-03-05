# __mocks__/

Manual Vitest mocks for node_modules packages.

## Why This Directory Is at the Project Root

Vitest resolves `vi.mock('mapbox-gl')` by looking for `__mocks__/mapbox-gl.ts` **adjacent to `node_modules`** (i.e., at the project root). If this directory were moved into `src/`, Vitest would auto-mock the module instead and the named spy exports (`mockOn`, `mockFlyTo`, etc.) would not be available.

## How to Add a New Mock

1. Create `__mocks__/<package-name>.ts`
2. Export the default and named exports the package uses
3. Export any spies you need to assert on in tests
4. Call `vi.mock('<package-name>')` at the top of any test file that needs it

## Importing Spies in Tests

Direct import paths to this directory depend on the test file's depth:

```ts
// from src/__tests__/hooks/
import { mockOn } from '../../../__mocks__/mapbox-gl';

// from src/__tests__/components/
import { mockOn } from '../../../__mocks__/mapbox-gl';
```

Always call `vi.clearAllMocks()` in `beforeEach` so spy call counts don't bleed between tests.
