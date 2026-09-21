import React, { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "../../lib/mediaPreferences";
import { NetworkPoint, Vector, advance, createField, drawField } from "./networkField";
import styles from "./heroSection.module.scss";

/** Tint of the network, read from the design token so both stay in sync. */
const COLOR_TOKEN = "--color-accent-on-dark";
const FALLBACK_COLOR = "#93c5fd";

/** Retina sharpness without paying for 3× backing stores on high-density phones. */
const MAX_PIXEL_RATIO = 2;

/**
 * Animated network drawn on a 2D canvas behind the hero copy: a drifting mesh
 * that lights up around the pointer (see `networkField.ts` for the engine).
 *
 * The canvas is purely decorative and self-limiting:
 *
 *  - **Sized to the hero, not the window.** A `ResizeObserver` keeps the
 *    backing store matched to the section (capped device-pixel ratio) and
 *    rebuilds the field on a real size change.
 *  - **Only animates while seen.** An `IntersectionObserver` stops the frame
 *    loop once the hero scrolls out of view; hidden tabs are already paused by
 *    `requestAnimationFrame` itself.
 *  - **One layout read per frame.** Pointer moves only record coordinates; the
 *    canvas rect is read once, inside the frame that consumes them.
 *  - **Respects motion and input preferences.** Under
 *    `prefers-reduced-motion: reduce` a single still frame is painted and no
 *    loop or listener is bound. Coarse pointers get the drift but no tracking
 *    — the glow stays centred, as in the original demo on touch devices.
 *  - **Fails quietly.** No 2D context (or no observers) means an empty canvas
 *    over the section's own gradient, never an error.
 */
export function HeroNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (
      !canvas ||
      !ctx ||
      typeof ResizeObserver === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const color = getComputedStyle(canvas).getPropertyValue(COLOR_TOKEN).trim() || FALLBACK_COLOR;
    const animate = !prefersReducedMotion();
    const trackPointer = animate && hasFinePointer();

    let width = 0;
    let height = 0;
    let points: NetworkPoint[] = [];
    let target: Vector = { x: 0, y: 0 };
    let pointerSeen = false;
    let pendingPointer: { clientX: number; clientY: number } | null = null;
    let visible = false;
    let frame: number | null = null;

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      drawField(ctx, points, target, color);
    };

    const tick = (now: number) => {
      frame = null;
      if (pendingPointer) {
        const rect = canvas.getBoundingClientRect();
        target = { x: pendingPointer.clientX - rect.left, y: pendingPointer.clientY - rect.top };
        pendingPointer = null;
      }
      advance(points, now);
      paint();
      if (visible) {
        frame = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (animate && visible && frame === null && points.length > 0) {
        frame = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    const resize = (nextWidth: number, nextHeight: number) => {
      if (nextWidth === width && nextHeight === height) {
        return;
      }
      width = nextWidth;
      height = nextHeight;

      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      // Resizing the backing store resets the context; draw in CSS pixels.
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      points = width > 0 && height > 0 ? createField(width, height, performance.now()) : [];
      if (!pointerSeen) {
        target = { x: width / 2, y: height / 2 };
      }

      if (animate) {
        start();
      } else {
        paint();
      }
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      resize(entry.contentRect.width, entry.contentRect.height);
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        start();
      } else {
        stop();
      }
    });
    intersectionObserver.observe(canvas);

    // The canvas sits under the copy and ignores the pointer, so moves are
    // caught on the section that hosts it.
    const host = canvas.parentElement;
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }
      pointerSeen = true;
      pendingPointer = { clientX: event.clientX, clientY: event.clientY };
    };
    if (trackPointer && host) {
      host.addEventListener("pointermove", handleMove, { passive: true });
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host?.removeEventListener("pointermove", handleMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.network} aria-hidden="true" />;
}
