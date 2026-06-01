import React from "react";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "./sectionWorkExperiences.module.scss";

type SectionWorkExperiencesProps = {
  locale?: PortfolioLocale;
};

export function SectionWorkExperiences({ locale = "fr" }: SectionWorkExperiencesProps) {
  const content = getPortfolioContent(locale).experience;

  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="experience-title" className={styles.title}>
            {content.title}
          </h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>

        <div className={styles.timeline}>
          {content.entries.map((entry) => (
            <article key={`${entry.roleTitle}-${entry.organizationLabel}-${entry.period}`} className={styles.card}>
              <p className={styles.period}>{entry.period}</p>
              <h3 className={styles.role}>{entry.roleTitle}</h3>
              <p className={styles.organization}>{entry.organizationLabel}</p>
              <p className={styles.blockLabel}>{content.contextLabel}</p>
              <p className={styles.blockText}>{entry.context}</p>
              <p className={styles.blockLabel}>{content.valueDeliveredLabel}</p>
              <p className={styles.blockText}>{entry.valueDelivered}</p>
              <ul className={styles.techList} aria-label={content.techListAriaLabel}>
                {entry.tech.map((item) => (
                  <li key={`${entry.organizationLabel}-${item}`} className={styles.techItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <a href="#educations" className={styles.educationCta}>
          {content.educationCta}
        </a>
      </div>
    </section>
  );
}
