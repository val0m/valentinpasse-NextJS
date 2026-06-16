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

function HeroBackground() {
  const [enable3d, setEnable3d] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastUserMoveRef = useRef(0);
  const startLoopRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    if (prefersReducedMotion()) {
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

    // Pause the auto-motion while the real cursor is moving; it resumes after
    // this short idle delay so genuine hover still wins.
    const idleDelayMs = 600;
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

        if (now - lastUserMoveRef.current > idleDelayMs) {
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

    // Mount the scene and run the loop only while the hero is on screen; the
    // loop is fully stopped once it scrolls out of view. Setting state from the
    // observer callback is the recommended "subscribe to an external system"
    // pattern (avoids a synchronous setState in the effect body).
    const node = bgRef.current;
    let observer: IntersectionObserver | undefined;
    if (node) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEnable3d(true);
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0 }
      );
      observer.observe(node);
    }

    return () => {
      window.removeEventListener("pointermove", handleRealMove);
      observer?.disconnect();
      stopLoop();
    };
  }, []);

  return (
    <div ref={bgRef} className={styles.background} aria-hidden="true">
      {enable3d && (
        <div ref={hostRef} className={styles.splineHost}>
          <Spline
            className={styles.spline}
            scene={SPLINE_SCENE}
            onLoad={() => startLoopRef.current()}
          />
        </div>
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
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = contentRef.current;
      if (!el) {
        return;
      }
      const scrollPosition = window.pageYOffset;
      const opacity = 1 - Math.min(scrollPosition / 400, 1);
      el.style.opacity = opacity.toString();
      el.style.transform = `translateY(${scrollPosition * 0.15}px)`;
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
