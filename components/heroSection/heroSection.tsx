import React from "react";
import styles from "./heroSection.module.scss";
import { TrustSignals } from "../trustSignals";

// ── Sub-components ──────────────────────────────────────────────────────────

function HeroHeadline() {
  return (
    <div className={styles.headline}>
      <h1 className={styles.name}>Valentin Passe</h1>
      <p className={styles.tagline}>
        Développeur Fullstack&nbsp;.NET&nbsp;·&nbsp;Freelance&nbsp;·&nbsp;Solutions IA stratégiques
      </p>
    </div>
  );
}

function HeroProofPoints() {
  const points = [
    "+10 ans d'expérience Fullstack .NET",
    "Expertise IA appliquée aux entreprises",
    "Disponible pour missions freelance",
  ];

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

function HeroActionGroup() {
  return (
    <div className={styles.actionGroup} role="group" aria-label="Actions principales">
      <a
        href="mailto:passe.valentin@gmail.com"
        className={`${styles.btn} ${styles.btnPrimary}`}
        aria-label="Envoyer un e-mail à Valentin Passe"
      >
        Me contacter
      </a>
      <a
        href="#projects"
        className={`${styles.btn} ${styles.btnOutline}`}
        aria-label="Voir les projets de Valentin Passe"
      >
        Voir mes projets
      </a>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className={styles.visual} aria-hidden="true">
      <div className={styles.avatar}>
        <span className={styles.initials}>VP</span>
      </div>
      <div className={styles.ring} />
      <div className={styles.ring2} />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function HeroSection() {
  const heroTrustSignals = [
    {
      label: "Deux missions freelance en parallele depuis 2023",
      supportingText:
        "SMEG et Groupe C8G: un rythme durable de delivery sur des contextes differents.",
      ctaLabel: "Voir les experiences",
      ctaTarget: "#experience",
    },
    {
      label: "Parcours continu depuis 2015",
      supportingText:
        "Plus de 10 ans de realisations .NET, du backend critique aux interfaces metier.",
      ctaLabel: "Voir les projets",
      ctaTarget: "#projects",
    },
  ];

  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.content}>
        <HeroHeadline />
        <p className={styles.promise}>
          Je conçois des applications web robustes, du back&#8209;end&nbsp;.NET
          à l&apos;interface Blazor.
        </p>
        <HeroProofPoints />
        <HeroActionGroup />
        <TrustSignals
          title="Signaux de confiance"
          items={heroTrustSignals}
          placement="hero"
          compact
        />
      </div>
      <HeroVisual />
    </section>
  );
}
