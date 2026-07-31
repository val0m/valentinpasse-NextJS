import React, { useEffect, useRef } from "react";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import { prefersReducedMotion } from "../../lib/mediaPreferences";
import styles from "./heroSection.module.scss";

type HeroSectionProps = {
  locale?: PortfolioLocale;
};

/**
 * Decorative backdrop, CSS only — it replaces the Spline WebGL scene this hero
 * used to mount (~2 MB of runtime, a cross-origin scene fetch, a WebGL2
 * capability probe, an error boundary and a synthetic-pointer rAF loop).
 *
 * Three stacked layers over the section's own dark gradient:
 *   1. two slow radial blooms, animated on `transform` only, so the drift stays
 *      on the compositor and never repaints;
 *   2. a static hairline grid fading toward the horizon, for the technical
 *      register;
 *   3. a static SVG grain that breaks gradient banding on wide dark surfaces.
 *
 * Nothing here is interactive, nothing is fetched, and nothing can throw.
 */
function HeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.blooms} />
      <div className={styles.gridLines} />
      <div className={styles.grain} />
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

  // Parallax fade of the hero copy as the user scrolls past it. Skipped entirely
  // under prefers-reduced-motion.
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
      <HeroBackdrop />

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
