import React from "react";
import Image from "next/image";
import Profile from "../../public/images/resume/valentin-passe.webp";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "./heroSection.module.scss";

type HeroSectionProps = {
  locale?: PortfolioLocale;
};

function HeroHeadline({ locale = "fr" }: HeroSectionProps) {
  const content = getPortfolioContent(locale).hero;

  return (
    <div className={styles.headline}>
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <h1 className={styles.name}>{content.name}</h1>
      <p className={styles.tagline}>{content.tagline}</p>
    </div>
  );
}

function HeroProofPoints({ locale = "fr" }: HeroSectionProps) {
  const points = getPortfolioContent(locale).hero.proofPoints;

  return (
    <ul className={styles.proofPoints} aria-label="Points clés">
      {points.map((point) => (
        <li key={point} className={styles.proofPoint}>
          <span className={styles.proofIcon} aria-hidden="true">✓</span>
          {point}
        </li>
      ))}
    </ul>
  );
}

function HeroActionGroup({ locale = "fr" }: HeroSectionProps) {
  const content = getPortfolioContent(locale).hero;

  return (
    <div className={styles.actionGroup} role="group" aria-label="Actions principales">
      <a
        href={content.primaryAction.href}
        className={`${styles.btn} ${styles.btnPrimary}`}
        aria-label={content.primaryAction.label}
      >
        {content.primaryAction.label}
      </a>
      <a
        href={content.secondaryAction.href}
        className={`${styles.btn} ${styles.btnOutline}`}
        aria-label={content.secondaryAction.label}
      >
        {content.secondaryAction.label}
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

function HeroVisual() {
  return (
    <div className={styles.visual} aria-hidden="true">
      <div className={styles.visualCard}>
        <div className={styles.portraitShell}>
          <Image
            src={Profile}
            alt="Portrait de Valentin Passe"
            className={styles.portrait}
            sizes="(max-width: 900px) 240px, 360px"
            priority
          />
        </div>
        <div className={styles.floatingPanel}>
          <p className={styles.floatingLabel}>Delivery focus</p>
          <p className={styles.floatingValue}>Architecture .NET, Blazor, IA utile</p>
        </div>
      </div>
      <div className={styles.ring} />
      <div className={styles.ring2} />
    </div>
  );
}

export function HeroSection({ locale = "fr" }: HeroSectionProps) {
  const content = getPortfolioContent(locale).hero;

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      <div className={styles.content}>
        <HeroHeadline locale={locale} />
        <p className={styles.promise}>{content.promise}</p>
        <HeroProofPoints locale={locale} />
        <HeroActionGroup locale={locale} />
        <HeroMetrics locale={locale} />
      </div>
      <HeroVisual />
    </section>
  );
}
