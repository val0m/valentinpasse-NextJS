import React, { CSSProperties, useRef } from "react";
import Image from "next/image";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import { isPublishableLink } from "../../lib/isPublishableLink";
import { usePointerHologram } from "../sectionProjects/usePointerHologram";
import { STACK_STEP_PX, STACK_TOP_PX, useStackDepth } from "./useStackDepth";
import styles from "./sectionWebsites.module.scss";

type SectionWebsitesProps = {
  locale?: PortfolioLocale;
};

/*
  Rendered widths of the two frames. Below 861px the device duo spans the
  column; above, it takes ~56 % of the container (browser ≈ 91 % of it, phone
  ≈ 25 %), which tops out at 640px / 170px once the container reaches 1240px.
*/
const DESKTOP_SIZES = "(max-width: 860px) 92vw, (max-width: 1280px) 46vw, 640px";
const MOBILE_SIZES = "(max-width: 860px) 24vw, (max-width: 1280px) 12vw, 170px";

/** Rank in the stack, read by the stylesheet to offset each card's sticky top. */
function stackStyle(rank: number): CSSProperties {
  return { "--i": rank } as CSSProperties;
}

export function SectionWebsites({ locale = "fr" }: SectionWebsitesProps) {
  const content = getPortfolioContent(locale).websites;
  const stackRef = useRef<HTMLDivElement>(null);

  usePointerHologram(stackRef);
  useStackDepth(stackRef);

  return (
    <section id="websites" className={styles.section} aria-labelledby="websites-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="websites-title" className={styles.title}>
            {content.title}
          </h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>

        <div
          ref={stackRef}
          className={styles.stack}
          style={
            {
              "--stack-top": `${STACK_TOP_PX}px`,
              "--stack-step": `${STACK_STEP_PX}px`,
            } as CSSProperties
          }
        >
          {content.items.map((site, index) => {
            const titleId = `website-${index}-title`;
            return (
              <article
                key={site.url}
                data-hologram-card=""
                data-stack-card=""
                // Alternates the side of the device duo from one card to the next.
                className={index % 2 ? `${styles.card} ${styles.cardFlip}` : styles.card}
                style={stackStyle(index)}
                aria-labelledby={titleId}
              >
                <div className={styles.cardContent}>
                  <div className={styles.stage}>
                    <div className={styles.browser}>
                      <div className={styles.browserBar}>
                        <span className={styles.dots} aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className={styles.address}>{site.host}</span>
                      </div>
                      <div className={styles.screen}>
                        <Image
                          src={site.media.desktop.src}
                          alt={site.media.desktop.alt}
                          fill
                          sizes={DESKTOP_SIZES}
                          loading="lazy"
                          className={styles.shot}
                        />
                      </div>
                    </div>
                    <div className={styles.phone}>
                      <div className={styles.phoneScreen}>
                        <Image
                          src={site.media.mobile.src}
                          alt={site.media.mobile.alt}
                          fill
                          sizes={MOBILE_SIZES}
                          loading="lazy"
                          className={styles.shot}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.copy}>
                    <p className={styles.kind}>
                      {site.kind} · {site.year}
                    </p>
                    <h3 id={titleId} className={styles.cardTitle}>
                      {site.title}
                    </h3>
                    <p className={styles.summary}>{site.summary}</p>

                    {/* Same rule as the Projets cards: the proof line never sits behind an interaction. */}
                    <p className={styles.outcome}>
                      <span className={styles.outcomeLabel}>{content.outcomeLabel}</span>
                      <span className={styles.outcomeText}>{site.outcome}</span>
                    </p>

                    <ul className={styles.tags} aria-label={content.tagsAriaLabel}>
                      {site.stack.map((tag) => (
                        <li key={`${site.url}-${tag}`} className={styles.tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <div className={styles.actions}>
                      <details className={styles.details}>
                        <summary className={styles.disclosure}>{content.disclosureLabel}</summary>
                        <ul className={styles.highlights}>
                          {site.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      </details>

                      {isPublishableLink(site.url) ? (
                        <a
                          href={site.url}
                          className={styles.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={content.externalLinkAriaTemplate.replace("{title}", site.title)}
                        >
                          {content.externalLinkLabel}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Closes the stack on the visitor's own project, with the same hologram. */}
          <article
            data-hologram-card=""
            data-stack-card=""
            className={`${styles.card} ${styles.cardNext}`}
            style={stackStyle(content.items.length)}
            aria-labelledby="website-next-title"
          >
            <div className={styles.nextContent}>
              <h3 id="website-next-title" className={styles.cardTitle}>
                {content.nextProject.title}
              </h3>
              <p className={styles.summary}>{content.nextProject.text}</p>
              <a href="#contact" className={styles.link}>
                {content.nextProject.ctaLabel}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
