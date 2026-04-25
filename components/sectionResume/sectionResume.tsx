import React from "react";
import Image from "next/image";

import Profile from "../../public/images/resume/valentin-passe.webp";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";

import styles from "./sectionResume.module.scss";

type SectionResumeProps = {
  locale?: PortfolioLocale;
};

export function SectionResume({ locale = "fr" }: SectionResumeProps) {
  const content = getPortfolioContent(locale).about;

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
            {content.title}
          </h2>
          <p className={styles.lead}>{content.lead}</p>

          <div className={styles.summary}>
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.principles} aria-label="Principes de travail">
            {content.principles.map((item) => (
              <span key={item} className={styles.principleChip}>
                {item}
              </span>
            ))}
          </div>

          <h3 className={styles.highlightsTitle}>
            {locale === "fr" ? "Pourquoi collaborer avec moi" : "Why work with me"}
          </h3>
          <ul className={styles.highlightsList}>
            {content.highlights.map((item) => (
              <li key={item.title} className={styles.highlightCard}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <a href="#projects" className={styles.primaryAction}>
              {content.primaryAction.label}
            </a>
            <a href="#contact" className={styles.secondaryAction}>
              {content.secondaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
