import React from "react";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "./sectionEducations.module.scss";

type SectionEducationsProps = {
  locale?: PortfolioLocale;
};

export function SectionEducations({ locale = "fr" }: SectionEducationsProps) {
  const content = getPortfolioContent(locale).education;

  return (
    <section id="educations" className={styles.section} aria-labelledby="educations-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="educations-title" className={styles.title}>
            {content.title}
          </h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>

        <div className={styles.grid}>
          {content.entries.map((entry) => (
            <article key={`${entry.period}-${entry.title}`} className={styles.card}>
              <p className={styles.period}>{entry.period}</p>
              <h3 className={styles.cardTitle}>{entry.title}</h3>
              <p className={styles.institution}>{entry.institution}</p>
              <p className={styles.description}>{entry.description}</p>
            </article>
          ))}
        </div>

        <aside className={styles.continuousLearning} aria-label={content.continuousLearningTitle}>
          <p className={styles.continuousLearningLabel}>{content.continuousLearningTitle}</p>
          <p className={styles.continuousLearningText}>{content.continuousLearningText}</p>
        </aside>
      </div>
    </section>
  );
}