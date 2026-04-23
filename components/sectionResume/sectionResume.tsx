import React from "react";
import Image from "next/image";

import Profile from "../../public/images/resume/valentin-passe.webp";

import styles from "./sectionResume.module.scss";
import { TrustSignals } from "../trustSignals";

type Highlight = {
  title: string;
  description: string;
};

const highlights: Highlight[] = [
  {
    title: "Livraison end-to-end",
    description:
      "Du cadrage métier au delivery, je pilote des applications web robustes, lisibles et orientées impact.",
  },
  {
    title: "Polyvalence Fullstack .NET",
    description:
      "Je relie back-end .NET, front-end Blazor et architecture API pour accélérer la mise en production.",
  },
  {
    title: "Vision produit & métier",
    description:
      "Je transforme des besoins business en solutions lisibles, maintenables et utiles pour vos utilisateurs finaux.",
  },
];

export function SectionResume() {
  const aboutTrustSignals = [
    {
      label: "Positionnement freelance + culture delivery",
      supportingText:
        "Experience combinee CDI et missions independantes pour s'adapter vite aux contraintes reelles.",
      ctaLabel: "Explorer les services",
      ctaTarget: "#services",
    },
    {
      label: "Approche orientee resultat",
      supportingText:
        "Les objectifs de livraison et la lisibilite du produit guident les choix techniques.",
      ctaLabel: "Voir des preuves en projets",
      ctaTarget: "#projects",
    },
  ];

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.portraitColumn}>
          <div className={styles.portraitFrame}>
            <Image
              src={Profile}
              alt="Portrait de Valentin Passe"
              className={styles.portrait}
              sizes="(max-width: 900px) 240px, 300px"
              priority={false}
            />
          </div>
        </div>

        <div className={styles.contentColumn}>
          <h2 id="about-title" className={styles.title}>
            À propos
          </h2>
          <p className={styles.lead}>
            Ingénieur Fullstack .NET freelance, j&apos;accompagne les entreprises
            qui veulent livrer plus vite des produits web fiables, lisibles et
            orientés impact.
          </p>

          <div className={styles.summary}>
            <p>
              J&apos;interviens sur l&apos;ensemble de la chaîne de valeur : conception,
              implémentation, qualité et mise en production. Mon objectif est
              de proposer une exécution claire, sans dette inutile, avec une
              vraie logique de résultat.
            </p>
            <p>
              Mon approche combine rigueur technique, communication directe et
              intégration IA pragmatique aux workflows pour booster l&apos;efficacité des équipes,
              sans complexifier l&apos;expérience utilisateur.
            </p>
          </div>

          <h3 className={styles.highlightsTitle}>Pourquoi collaborer avec moi</h3>
          <ul className={styles.highlightsList}>
            {highlights.map((item) => (
              <li key={item.title} className={styles.highlightCard}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>

          <TrustSignals title="Reassurance" items={aboutTrustSignals} placement="about" compact />

          <div className={styles.actions}>
            <a href="#projects" className={styles.primaryAction}>
              Voir mes projets
            </a>
            <a href="#contact" className={styles.secondaryAction}>
              Me contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
