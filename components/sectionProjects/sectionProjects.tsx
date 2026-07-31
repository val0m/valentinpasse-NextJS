import React, { useRef } from "react";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import { usePointerHologram } from "./usePointerHologram";
import styles from "./sectionProjects.module.scss";

type SectionProjectsProps = {
  locale?: PortfolioLocale;
};

/**
 * Only an absolute https URL may reach the markup: a relative one would resolve
 * against the portfolio itself, and an http one would downgrade the connection
 * on a link opened in a new tab.
 */
function isPublishableLink(url: string | undefined): url is string {
  return typeof url === "string" && /^https:\/\/\S+$/.test(url.trim());
}

export function SectionProjects({ locale = "fr" }: SectionProjectsProps) {
  const content = getPortfolioContent(locale).projects;
  const gridRef = useRef<HTMLDivElement>(null);

  usePointerHologram(gridRef);

  // A project missing its title or its summary would render as an empty cell in
  // the bento; drop it rather than punch a hole in the grid.
  const projects = content.items.filter(
    (project) => project.title?.trim() && project.summary?.trim()
  );

  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="projects-title" className={styles.title}>
            {content.title}
          </h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>

        <div ref={gridRef} className={styles.grid}>
          {projects.map((project, index) => (
            <article
              key={project.title}
              // Read by usePointerHologram to resolve the hovered card without
              // depending on a hashed CSS-module class name.
              data-hologram-card=""
              className={index === 0 ? `${styles.card} ${styles.cardFeatured}` : styles.card}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.summary}>{project.summary}</p>

                {/*
                  Summary and outcome stay out of any disclosure on purpose: #38
                  added verifiable outcomes for search and AI-citation value, so
                  they must never sit behind an interaction.
                */}
                <p className={styles.outcome}>
                  <span className={styles.outcomeLabel}>{content.outcomeLabel}</span>
                  <span className={styles.outcomeText}>{project.outcome}</span>
                </p>

                <ul className={styles.tags} aria-label={content.tagsAriaLabel}>
                  {project.tags.map((tag) => (
                    <li key={`${project.title}-${tag}`} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>

                {/*
                  Native <details>: keyboard operation and expanded-state
                  announcement come for free, and the collapsed copy stays in the
                  DOM, hence crawlable.
                */}
                <details className={styles.details}>
                  <summary className={styles.disclosure}>{content.disclosureLabel}</summary>
                  <div className={styles.detailsBody}>
                    <p className={styles.blockLabel}>{content.contextLabel}</p>
                    <p className={styles.blockText}>{project.context}</p>

                    <p className={styles.blockLabel}>{content.contributionLabel}</p>
                    <p className={styles.blockText}>{project.contribution}</p>
                  </div>
                </details>

                {isPublishableLink(project.publicLink) ? (
                  <a
                    href={project.publicLink}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={content.externalLinkAriaTemplate.replace("{title}", project.title)}
                  >
                    {content.externalLinkLabel}
                  </a>
                ) : null}
              </div>
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
