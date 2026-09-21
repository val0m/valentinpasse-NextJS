/**
 * Test helper: jsdom implements no media queries, so components guarded by
 * `matchMedia` need one injected. Callers declare which queries match.
 *
 * `jest.setup.ts` installs `window.matchMedia` as writable but not configurable,
 * hence the plain assignment rather than `Object.defineProperty`.
 */
export function mockMatchMedia(matches: (query: string) => boolean): void {
  window.matchMedia = ((query: string) => ({
    matches: matches(query),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

export const FINE_POINTER = (query: string) => query === "(hover: hover) and (pointer: fine)";
export const REDUCED_MOTION = (query: string) => query === "(prefers-reduced-motion: reduce)";
export const NO_PREFERENCE = () => false;
