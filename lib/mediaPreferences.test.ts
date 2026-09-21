import { hasFinePointer, prefersReducedMotion } from "./mediaPreferences";
import { FINE_POINTER, NO_PREFERENCE, REDUCED_MOTION, mockMatchMedia } from "./testing/mockMatchMedia";

describe("mediaPreferences", () => {
  afterEach(() => mockMatchMedia(NO_PREFERENCE));

  it("reports the reduced-motion preference when the query matches", () => {
    mockMatchMedia(REDUCED_MOTION);

    expect(prefersReducedMotion()).toBe(true);
    expect(hasFinePointer()).toBe(false);
  });

  it("reports a fine pointer only when hover and precision are both available", () => {
    mockMatchMedia(FINE_POINTER);

    expect(hasFinePointer()).toBe(true);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("reports no preference when nothing matches", () => {
    mockMatchMedia(NO_PREFERENCE);

    expect(prefersReducedMotion()).toBe(false);
    expect(hasFinePointer()).toBe(false);
  });

  it("answers conservatively where matchMedia is unavailable", () => {
    // The SSR / older-jsdom path: neither probe may throw, and both must report
    // the safe answer — no fine pointer, no motion preference expressed.
    const original = window.matchMedia;
    // @ts-expect-error deliberately simulating an environment without matchMedia
    delete window.matchMedia;

    expect(prefersReducedMotion()).toBe(false);
    expect(hasFinePointer()).toBe(false);

    window.matchMedia = original;
  });
});
