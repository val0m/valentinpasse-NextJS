import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "./heroSection.module.scss";

// Spline ships a heavy WebGL runtime + loads a remote scene, so we defer it:
// no SSR, lazy-loaded on the client, and only when the user has not requested
// reduced motion. The dark gradient backdrop renders immediately as a fallback.
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

const SPLINE_SCENE = "https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode";

// Schedule the (heavy) Spline mount during browser idle time so its ~1.5-2 MB
// WebGL runtime never evaluates inside the critical LCP / first-input window.
// `requestIdleCallback` keeps it off the main thread until the page is quiet;
// the `timeout` is a hard cap so the 3D still appears promptly on fast devices.
// Falls back to a short `setTimeout` where the API is unavailable (e.g. Safari,
// jsdom in tests).
function scheduleIdle(callback: () => void, timeout: number): number {
  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    return window.requestIdleCallback(callback, { timeout });
  }
  return window.setTimeout(callback, 200);
}

function cancelIdle(handle: number): void {
  if (typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(handle);
  } else {
    window.clearTimeout(handle);
  }
}

type HeroSectionProps = {
  locale?: PortfolioLocale;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Spline instantiates a three.js WebGLRenderer that needs a WebGL2 context (the
// scene relies on float depth textures). Its constructor THROWS ("Error creating
// WebGL context.") wherever that context cannot be created: hardware
// acceleration off, blocklisted GPU, WebGL disabled by policy/extension, out of
// contexts, or WebGL2 specifically unavailable — e.g. Firefox falling back to
// software rendering reports "AllowWebgl2:false restricts context creation". A
// WebGL1-only browser is enough to pass a naive check yet still fails here. That
// throw happens synchronously in react-spline's effect — the library only
// catches the async scene load — so it escapes to React's root error boundary
// and replaces the whole page with "Application error: a client-side exception
// has occurred". We probe for the exact context Spline needs (WebGL2) and never
// mount the scene when it is unavailable, so those browsers degrade cleanly to
// the static backdrop instead of mounting a doomed renderer.
function supportsWebGL2(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl = (window.WebGL2RenderingContext &&
      canvas.getContext("webgl2")) as WebGL2RenderingContext | null;
    // Release the probe's context immediately: browsers cap the number of live
    // WebGL contexts, and holding an idle one for the page's lifetime (on top of
    // Spline's own) wastes a slot and nudges toward the very "too many contexts"
    // failure this guard exists to prevent.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

// Safety net for the case above: even when the probe passes, actual scene
// creation can still fail (context lost, out of memory, too many live WebGL
// contexts, driver crash). This boundary contains any such failure to the hero
// so the page degrades to its static gradient backdrop instead of crashing.
class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // Swallowed on purpose: the hero simply falls back to its backdrop.
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function HeroBackground() {
  const [enable3d, setEnable3d] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastUserMoveRef = useRef(0);
  const startLoopRef = useRef<() => void>(() => undefined);
  // Tracks whether the scene has been mounted, and the pending idle handle, so
  // the observer defers the first mount but resumes the loop instantly on later
  // re-entries into the viewport.
  const enabledRef = useRef(false);
  const idleHandleRef = useRef<number | null>(null);
  // Tracks whether the hero is currently on screen, so a tab-visibility change
  // only resumes the ambient motion when the scene is actually visible.
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    // Never attempt the WebGL scene when the browser cannot provide a WebGL2
    // context: mounting Spline there throws and takes the whole page down (see
    // supportsWebGL2). The static backdrop stays as the graceful fallback.
    if (!supportsWebGL2()) {
      return;
    }

    // Record genuine cursor activity so the auto-motion can yield to it.
    // Our synthetic events have isTrusted === false and are ignored here.
    const handleRealMove = (event: PointerEvent | MouseEvent) => {
      if (event.isTrusted) {
        lastUserMoveRef.current = performance.now();
      }
    };
    window.addEventListener("pointermove", handleRealMove, { passive: true });

    // Treat active scrolling as user activity too: while the page scrolls we
    // stop feeding synthetic moves to the canvas so the (expensive) WebGL
    // re-render never competes with the scroll's own compositing. The ambient
    // motion resumes once scrolling settles (same idle delay as hover).
    const handleScrollActivity = () => {
      lastUserMoveRef.current = performance.now();
    };
    window.addEventListener("scroll", handleScrollActivity, { passive: true });

    // Pause the auto-motion while the real cursor is moving (or the page is
    // scrolling); it resumes after this short idle delay so genuine hover wins.
    const idleDelayMs = 600;
    // Cap the synthetic-move cadence: this is a slow decorative drift, so ~30
    // dispatches/sec look identical to 60 while halving the Spline re-renders.
    const frameIntervalMs = 1000 / 30;
    let lastDispatch = 0;
    let startTime: number | null = null;

    const stopLoop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    // Drive the cursor-reactive Spline scene on its own: feed the canvas
    // synthetic pointer moves along a slow Lissajous path so the 3D keeps
    // animating without real mouse movement. The early return guards against
    // stacking duplicate loops if this is re-triggered.
    const startLoop = () => {
      if (rafRef.current !== null) {
        return;
      }
      const canvas = hostRef.current?.querySelector("canvas");
      if (!canvas) {
        return;
      }

      const tick = (now: number) => {
        if (startTime === null) {
          startTime = now;
        }

        if (
          now - lastUserMoveRef.current > idleDelayMs &&
          now - lastDispatch >= frameIntervalMs
        ) {
          lastDispatch = now;
          const t = (now - startTime) / 1000;
          const rect = canvas.getBoundingClientRect();
          const x = rect.left + rect.width * (0.5 + 0.32 * Math.sin(t * 0.55));
          const y = rect.top + rect.height * (0.5 + 0.26 * Math.cos(t * 0.4));

          canvas.dispatchEvent(
            new PointerEvent("pointermove", {
              clientX: x,
              clientY: y,
              pointerId: 1,
              pointerType: "mouse",
              isPrimary: true,
              bubbles: true,
              cancelable: true,
            })
          );
          canvas.dispatchEvent(
            new MouseEvent("mousemove", {
              clientX: x,
              clientY: y,
              bubbles: true,
              cancelable: true,
            })
          );
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    startLoopRef.current = startLoop;

    // Defer the heavy first mount to idle time so the WebGL runtime stays out of
    // the LCP / first-input window, then run the loop only while the hero is on
    // screen. Setting state from the observer callback is the recommended
    // "subscribe to an external system" pattern (avoids a synchronous setState
    // in the effect body).
    const enableNow = () => {
      idleHandleRef.current = null;
      enabledRef.current = true;
      setEnable3d(true);
      // The motion loop starts from Spline's onLoad once the canvas exists.
    };

    const scheduleEnable = () => {
      if (enabledRef.current || idleHandleRef.current !== null) {
        return;
      }
      idleHandleRef.current = scheduleIdle(enableNow, 3000);
    };

    const node = bgRef.current;
    let observer: IntersectionObserver | undefined;
    if (node) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersectingRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (enabledRef.current) {
              // Already mounted: just resume the motion on re-entry.
              startLoop();
            } else {
              scheduleEnable();
            }
          } else {
            stopLoop();
          }
        },
        { threshold: 0 }
      );
      observer.observe(node);
    }

    // Suspend the WebGL render loop entirely while the tab is hidden — there is
    // no point animating an off-screen scene — and resume it only if the hero
    // is still on screen when the tab comes back.
    const handleVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else if (enabledRef.current && isIntersectingRef.current) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pointermove", handleRealMove);
      window.removeEventListener("scroll", handleScrollActivity);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer?.disconnect();
      stopLoop();
      if (idleHandleRef.current !== null) {
        cancelIdle(idleHandleRef.current);
        idleHandleRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={bgRef} className={styles.background} aria-hidden="true">
      {enable3d && (
        <SplineErrorBoundary>
          <div ref={hostRef} className={styles.splineHost}>
            <Spline
              className={styles.spline}
              scene={SPLINE_SCENE}
              onLoad={() => startLoopRef.current()}
            />
          </div>
        </SplineErrorBoundary>
      )}
      <div className={styles.backdrop} />
    </div>
  );
}

function HeroHeadline({ locale = "fr" }: HeroSectionProps) {
  const hero = getPortfolioContent(locale).hero;

  return (
    <div className={styles.headline}>
      <p className={styles.eyebrow}>{hero.eyebrow}</p>
      <h1 className={styles.name}>{hero.name}</h1>
      <p className={styles.tagline}>{hero.tagline}</p>
    </div>
  );
}

function HeroActions({ locale = "fr" }: HeroSectionProps) {
  const hero = getPortfolioContent(locale).hero;

  return (
    <div className={styles.actionGroup} role="group" aria-label={hero.actionsAriaLabel}>
      <a
        href={hero.primaryAction.href}
        className={`${styles.btn} ${styles.btnPrimary}`}
        aria-label={hero.primaryAction.label}
      >
        {hero.primaryAction.label}
      </a>
      <a
        href={hero.secondaryAction.href}
        className={`${styles.btn} ${styles.btnOutline}`}
        aria-label={hero.secondaryAction.label}
      >
        {hero.secondaryAction.label}
      </a>
    </div>
  );
}

function HeroMetrics({ locale = "fr" }: HeroSectionProps) {
  const metrics = getPortfolioContent(locale).hero.metrics;

  return (
    <div className={styles.metrics}>
      {metrics.map((metric) => (
        <article key={`${metric.value}-${metric.label}`} className={styles.metricCard}>
          <p className={styles.metricValue}>{metric.value}</p>
          <p className={styles.metricLabel}>{metric.label}</p>
        </article>
      ))}
    </div>
  );
}

export function HeroSection({ locale = "fr" }: HeroSectionProps) {
  const hero = getPortfolioContent(locale).hero;
  const contentRef = useRef<HTMLDivElement>(null);

  // Parallax fade of the hero copy as the user scrolls past it, mirroring the
  // source component. Skipped entirely under prefers-reduced-motion.
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    // Coalesce scroll events to a single pending frame so fast scrolling never
    // queues redundant layout work.
    const PARALLAX_RANGE = 400;
    let ticking = false;
    let lastTravel = -1;
    const update = () => {
      ticking = false;
      const el = contentRef.current;
      if (!el) {
        return;
      }
      // The parallax only affects the hero's first PARALLAX_RANGE px of travel.
      // Past that, nothing changes — so once the hero has scrolled out we stop
      // writing styles every frame. Otherwise the compositor keeps updating the
      // (already invisible) hero layer on every scroll event for the whole long
      // page, which is what makes scrolling feel heavy.
      const travel = Math.min(window.pageYOffset, PARALLAX_RANGE);
      if (travel === lastTravel) {
        return;
      }
      lastTravel = travel;
      el.style.opacity = (1 - travel / PARALLAX_RANGE).toString();
      el.style.transform = `translateY(${travel * 0.15}px)`;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Apply the correct initial state in case the page loads already scrolled
    // (e.g. when navigating to a hash).
    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className={styles.hero} aria-label={hero.sectionAriaLabel}>
      <HeroBackground />

      <div ref={contentRef} className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.lead}>
            <HeroHeadline locale={locale} />
            <HeroActions locale={locale} />
          </div>
          <HeroMetrics locale={locale} />
        </div>
      </div>
    </section>
  );
}
