import React from "react";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "./sectionProjects.module.scss";

type SectionProjectsProps = {
  locale?: PortfolioLocale;
};

export function SectionProjects({ locale = "fr" }: SectionProjectsProps) {
  const content = getPortfolioContent(locale).projects;

  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="projects-title" className={styles.title}>
            {content.title}
          </h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>

        <div className={styles.grid}>
          {content.items.map((project) => (
            <article key={project.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.summary}>{project.summary}</p>

              <p className={styles.blockLabel}>Contexte</p>
              <p className={styles.blockText}>{project.context}</p>

              <p className={styles.blockLabel}>Contribution</p>
              <p className={styles.blockText}>{project.contribution}</p>

              <p className={styles.blockLabel}>Résultat</p>
              <p className={styles.blockText}>{project.outcome}</p>

              <ul className={styles.tags} aria-label="Technologies et compétences projet">
                {project.tags.map((tag) => (
                  <li key={`${project.title}-${tag}`} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>

              {project.publicLink ? (
                <a
                  href={project.publicLink}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Voir le site de ${project.title} (lien externe)`}
                >
                  {locale === "fr" ? "Voir un lien public" : "View public link"}
                </a>
              ) : null}
            </article>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <a href="#contact" className={styles.primaryCta}>
            {content.primaryAction.label}
          </a>
          <a href="#contact" className={styles.secondaryCta}>
            {content.secondaryAction.label}
          </a>
        </div>
      </div>
    </section>
  );
}
