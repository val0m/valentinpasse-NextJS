import { RefObject, useEffect } from "react";
import { hasFinePointer, prefersReducedMotion } from "../../lib/mediaPreferences";

/**
 * Cards opt into pointer tracking through this attribute rather than a CSS
 * module class, so the hook never depends on a hashed class name.
 */
const CARD_SELECTOR = "[data-hologram-card]";

const TRACKED_PROPERTIES = ["--mx", "--my", "--tilt-x", "--tilt-y"] as const;

/**
 * Drives the holographic treatment of the projects grid: writes the pointer
 * position (`--mx`, `--my`, in %) and the normalised offset from the card
 * centre (`--tilt-x`, `--tilt-y`, in -0.5..0.5) onto the hovered card, where
 * the stylesheet turns them into a spotlight and a capped 3D tilt.
 *
 * Three constraints shape the implementation:
 *
 *  - **One listener, not one per card.** The `pointermove` handler is delegated
 *    on the grid container and resolves the hovered card with `closest()`.
 *  - **One write per frame.** Moves only record their coordinates; a single
 *    `requestAnimationFrame` flushes them, so a fast pointer never queues
 *    redundant style work.
 *  - **Never bound where it does not belong.** Nothing is attached under
 *    `prefers-reduced-motion: reduce`, nor on coarse pointers, where a tilt
 *    would only leave cards stuck in a hovered state after a tap.
 */
export function usePointerHologram(gridRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion() || !hasFinePointer()) {
      return;
    }

    let frame: number | null = null;
    let pending: { card: HTMLElement; clientX: number; clientY: number } | null = null;
    let activeCard: HTMLElement | null = null;

    const reset = (card: HTMLElement) => {
      TRACKED_PROPERTIES.forEach((property) => card.style.removeProperty(property));
    };

    const flush = () => {
      frame = null;
      const next = pending;
      pending = null;
      if (!next) {
        return;
      }

      const { card, clientX, clientY } = next;
      const rect = card.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      card.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
      card.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
      card.style.setProperty("--tilt-x", (x - 0.5).toFixed(4));
      card.style.setProperty("--tilt-y", (y - 0.5).toFixed(4));
    };

    const handleMove = (event: PointerEvent) => {
      // Hybrid machines report a fine pointer yet still emit touch events; a tap
      // must not leave a card tilted with no way to un-hover it.
      if (event.pointerType === "touch") {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest<HTMLElement>(CARD_SELECTOR) ?? null;

      if (card !== activeCard) {
        if (activeCard) {
          reset(activeCard);
        }
        activeCard = card;
      }

      if (!card) {
        pending = null;
        return;
      }

      pending = { card, clientX: event.clientX, clientY: event.clientY };
      if (frame === null) {
        frame = requestAnimationFrame(flush);
      }
    };

    const handleLeave = () => {
      pending = null;
      if (activeCard) {
        reset(activeCard);
        activeCard = null;
      }
    };

    grid.addEventListener("pointermove", handleMove, { passive: true });
    grid.addEventListener("pointerleave", handleLeave);
    // The OS or an input device can take the gesture over mid-move; without
    // this the card would stay tilted until the next pointermove.
    grid.addEventListener("pointercancel", handleLeave);

    return () => {
      grid.removeEventListener("pointermove", handleMove);
      grid.removeEventListener("pointerleave", handleLeave);
      grid.removeEventListener("pointercancel", handleLeave);
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      handleLeave();
    };
  }, [gridRef]);
}
