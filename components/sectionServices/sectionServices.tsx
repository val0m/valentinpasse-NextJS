import React from "react";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "./sectionServices.module.scss";

type SectionServicesProps = {
  locale?: PortfolioLocale;
};

export function SectionServices({ locale = "fr" }: SectionServicesProps) {
  const content = getPortfolioContent(locale).services;
  const services = content.items;

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="services-title" className={styles.title}>
            {content.title}
          </h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>

        <div className={styles.grid}>
          {services.map((service, serviceIndex) => (
            <article key={`${service.title}-${serviceIndex}`} className={styles.card}>
              <h3 className={styles.cardTitle}>{service.title}</h3>

              <div className={styles.block}>
                <p className={styles.blockLabel}>{content.clientProblemLabel}</p>
                <p className={styles.blockText}>{service.clientProblem}</p>
              </div>

              <div className={styles.block}>
                <p className={styles.blockLabel}>{content.businessOutcomeLabel}</p>
                <p className={styles.blockText}>{service.businessOutcome}</p>
              </div>

              <ul className={styles.capabilities}>
                {service.capabilities.map((capability, capabilityIndex) => (
                  <li key={`${service.title}-${capability}-${capabilityIndex}`}>{capability}</li>
                ))}
              </ul>

              <a
                href={service.ctaTarget}
                className={styles.cardAction}
                aria-label={content.contactAriaTemplate.replace("{title}", service.title)}
              >
                {locale === "fr" ? "Discuter de ce service" : "Discuss this service"}
              </a>
            </article>
          ))}
        </div>

        {services.length === 0 ? (
          <p className={styles.fallback}>
            {locale === "fr"
              ? "Les services sont temporairement indisponibles. Vous pouvez me contacter directement via la section contact."
              : "Services are temporarily unavailable. You can still contact me directly from the contact section."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
