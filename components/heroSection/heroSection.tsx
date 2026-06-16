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

  useEffect(() => {
    if (!prefersReducedMotion()) {
      setEnable3d(true);
    }
  }, []);

  return (
    <div className={styles.background} aria-hidden="true">
      {enable3d && <Spline className={styles.spline} scene={SPLINE_SCENE} />}
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Parallax fade of the hero copy as the user scrolls past it, mirroring the
  // source component. Skipped entirely under prefers-reduced-motion.
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) {
        return;
      }

      requestAnimationFrame(() => {
        const scrollPosition = window.pageYOffset;
        const opacity = 1 - Math.min(scrollPosition / 400, 1);
        el.style.opacity = opacity.toString();
        el.style.transform = `translateY(${scrollPosition * 0.15}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
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
