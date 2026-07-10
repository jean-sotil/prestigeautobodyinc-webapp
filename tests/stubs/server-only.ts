/**
 * Test-only stub for the `server-only` package.
 *
 * Next.js vendors and aliases `server-only` internally during its own
 * webpack build (see node_modules/next/dist/compiled/server-only), so the
 * real npm package never needs to be installed for `next build`/`next dev`
 * to work. Vitest, however, runs on plain Vite and has no knowledge of that
 * Next-specific aliasing, so it fails to resolve the bare `server-only`
 * specifier used by modules like `src/lib/google-places.ts`.
 *
 * This stub mirrors the real package (a no-op module) and is wired up via
 * `resolve.alias` in `vitest.config.ts` so those modules can be imported
 * and unit-tested directly.
 */
export {};
