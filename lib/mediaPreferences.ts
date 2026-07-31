/**
 * Media-query probes shared by the decorative motion of the hero backdrop and
 * the projects grid.
 *
 * They are read imperatively rather than kept in React state on purpose: both
 * only gate whether an effect binds at all. A visitor flipping the OS setting
 * mid-session picks up the new behaviour on the next mount, which is a fair
 * trade for keeping these components free of extra media-query listeners.
 *
 * Every probe tolerates SSR and jsdom, where `window` or `matchMedia` may be
 * missing, by reporting `false` — i.e. "no motion preference expressed" and
 * "no fine pointer", the conservative answer in both cases.
 */

function mediaMatches(query: string): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(query).matches
  );
}

export function prefersReducedMotion(): boolean {
  return mediaMatches("(prefers-reduced-motion: reduce)");
}

/**
 * True only where the primary pointer both hovers and is precise — a mouse or a
 * trackpad. Touch and stylus are deliberately excluded: pointer-tracked tilt and
 * spotlight carry no meaning there and would leave a card stuck in its hovered
 * state after a tap.
 */
export function hasFinePointer(): boolean {
  return mediaMatches("(hover: hover) and (pointer: fine)");
}
