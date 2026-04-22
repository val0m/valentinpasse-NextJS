import React from "react";
import styles from "./sectionServices.module.scss";
import servicesData from "../../public/data/services.json";

type ServiceOffer = {
  title: string;
  clientProblem: string;
  businessOutcome: string;
  capabilities: string[];
  ctaTarget: string;
};

function sanitizeServices(items: ServiceOffer[]): ServiceOffer[] {
  return items.filter((item) => {
    if (!item?.title?.trim()) {
      return false;
    }
    if (!item.clientProblem?.trim() || !item.businessOutcome?.trim()) {
      return false;
    }
    if (!Array.isArray(item.capabilities) || item.capabilities.length < 2) {
      return false;
    }
    return !!item.ctaTarget?.trim();
  });
}

export function SectionServices() {
  const services = sanitizeServices(servicesData as ServiceOffer[]);

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
          {services.map((service) => (
            <article key={service.title} className={styles.card}>
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
                {service.capabilities.map((capability) => (
                  <li key={`${service.title}-${capability}`}>{capability}</li>
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
