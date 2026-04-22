import React from "react";
import styles from "./sectionServices.module.scss";
import servicesData from "../../public/data/services.json";
import { sanitizeServices } from "./sectionServices.extensions";

export function SectionServices() {
  const services = sanitizeServices(servicesData);

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="services-title" className={styles.title}>
            Services
          </h2>
          <p className={styles.subtitle}>
            Des offres concrètes pour transformer un besoin métier en solution
            livrée, exploitable et évolutive.
          </p>
        </header>

        <div className={styles.grid}>
          {services.map((service, serviceIndex) => (
            <article key={`${service.title}-${serviceIndex}`} className={styles.card}>
              <h3 className={styles.cardTitle}>{service.title}</h3>

              <div className={styles.block}>
                <p className={styles.blockLabel}>Problème adressé</p>
                <p className={styles.blockText}>{service.clientProblem}</p>
              </div>

              <div className={styles.block}>
                <p className={styles.blockLabel}>Bénéfice métier</p>
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
                aria-label={`Me contacter pour ${service.title}`}
              >
                Discuter de ce service
              </a>
            </article>
          ))}
        </div>

        {services.length === 0 ? (
          <p className={styles.fallback}>
            Les services sont temporairement indisponibles. Vous pouvez me
            contacter directement via la section contact.
          </p>
        ) : null}
      </div>
    </section>
  );
}
