import React from "react";
import Image from "next/image";

import Profile from "../../public/images/resume/valentin-passe.webp";

import styles from "./sectionResume.module.scss";

type Highlight = {
  title: string;
  description: string;
};

const highlights: Highlight[] = [
  {
    title: "Livraison end-to-end",
    description:
      "Du cadrage fonctionnel au delivery, je pilote des applications web robustes avec une approche orientee resultat.",
  },
  {
    title: "Polyvalence Fullstack .NET",
    description:
      "Je relie back-end .NET, front-end React/Blazor et architecture API pour accelerer la mise en production.",
  },
  {
    title: "Vision produit & metier",
    description:
      "Je transforme des besoins business en solutions lisibles, maintenables et utiles pour vos utilisateurs finaux.",
  },
];

export function SectionResume() {
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
            A propos
          </h2>
          <p className={styles.lead}>
            Ingenieur Fullstack .NET freelance, j&apos;accompagne les entreprises
            qui veulent livrer plus vite des produits web fiables, lisibles et
            orientés impact.
          </p>

          <div className={styles.summary}>
            <p>
              J&apos;interviens sur l&apos;ensemble de la chaine de valeur: conception,
              implementation, qualite et mise en production. Mon objectif est
              de proposer une execution claire, sans dette inutile, avec une
              vraie logique de resultat.
            </p>
            <p>
              Mon approche combine rigueur technique, communication simple et
              affinite IA pragmatique pour booster l&apos;efficacite des equipes,
              sans complexifier l&apos;experience utilisateur.
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
