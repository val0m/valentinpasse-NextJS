import { RefObject, useEffect } from "react";
import { hasFinePointer, prefersReducedMotion } from "../../lib/mediaPreferences";

/** Cards take part in the stack through this attribute, never a hashed class name. */
const STACK_CARD_SELECTOR = "[data-stack-card]";

/** Sticky offset of the first card: clears the header floating over the page. */
export const STACK_TOP_PX = 104;

/** Extra offset per rank, so each covered card keeps a sliver of its top edge visible. */
export const STACK_STEP_PX = 18;

/** Room kept under a stuck card, so a card exactly as tall as the room still unsticks. */
const BOTTOM_MARGIN_PX = 16;

/** Share of a card hidden by the next one beyond which it stops reacting to the pointer. */
const COVERED_THRESHOLD = 0.35;

const MAX_SHRINK = 0.05;
const MAX_DIM = 0.45;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function clearDepth(card: HTMLElement): void {
  card.style.removeProperty("--s");
  card.style.removeProperty("--b");
  card.removeAttribute("data-depth");
  card.removeAttribute("data-covered");
}

/**
 * Drives the sticky stack of the web work section.
 *
 *  - **Unsticking.** A card taller than the room left under its sticky offset
 *    would have its bottom hidden by the next one, so it gets `data-unstuck`
 *    and the stylesheet puts it back in the flow. Measured on mount, on resize,
 *    and whenever a card changes size (a `<details>` opening included). This is
 *    a legibility guarantee, not motion: it runs whatever the preferences.
 *
 *  - **Depth.** As a card slides under the next one it shrinks by up to 5 % and
 *    dims (`--s`, `--b`, flagged by `data-depth`); past 35 % coverage it gets
 *    `data-covered`, which switches its hologram off in CSS. Driven by one
 *    passive scroll listener coalesced into a `requestAnimationFrame`, and never
 *    bound under `prefers-reduced-motion: reduce` nor on coarse pointers.
 *
 * Depth is written to `scale` / `filter` by the stylesheet, never `transform`,
 * so it composes with the tilt usePointerHologram drives on the same cards.
 */
export function useStackDepth(stackRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) {
      return;
    }

    const cards = Array.from(stack.querySelectorAll<HTMLElement>(STACK_CARD_SELECTOR));
    if (cards.length === 0) {
      return;
    }

    const measure = () => {
      cards.forEach((card, index) => {
        const room =
          window.innerHeight - (STACK_TOP_PX + index * STACK_STEP_PX) - BOTTOM_MARGIN_PX;
        card.toggleAttribute("data-unstuck", card.offsetHeight > room);
      });
    };

    const withDepth = !prefersReducedMotion() && hasFinePointer();
    let frame: number | null = null;

    const paint = () => {
      frame = null;
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        const height = card.offsetHeight;
        if (!next || height === 0 || card.hasAttribute("data-unstuck")) {
          clearDepth(card);
          return;
        }

        const covered = clamp(
          1 - (next.getBoundingClientRect().top - card.getBoundingClientRect().top) / height,
          0,
          1
        );
        if (covered === 0) {
          clearDepth(card);
          return;
        }

        card.style.setProperty("--s", (1 - covered * MAX_SHRINK).toFixed(4));
        card.style.setProperty("--b", (1 - covered * MAX_DIM).toFixed(4));
        card.setAttribute("data-depth", "");
        card.toggleAttribute("data-covered", covered > COVERED_THRESHOLD);
      });
    };

    const requestPaint = () => {
      if (withDepth && frame === null) {
        frame = requestAnimationFrame(paint);
      }
    };

    const handleResize = () => {
      measure();
      requestPaint();
    };

    measure();
    requestPaint();

    window.addEventListener("resize", handleResize);
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(handleResize);
    cards.forEach((card) => resizeObserver?.observe(card));

    if (withDepth) {
      window.addEventListener("scroll", requestPaint, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", requestPaint);
      resizeObserver?.disconnect();
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      cards.forEach((card) => {
        clearDepth(card);
        card.removeAttribute("data-unstuck");
      });
    };
  }, [stackRef]);
}
