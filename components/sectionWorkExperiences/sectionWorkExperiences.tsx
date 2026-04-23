import React from "react";
import styles from "./sectionWorkExperiences.module.scss";

type ExperienceEntry = {
  roleTitle: string;
  organizationLabel: string;
  period: string;
  context: string;
  valueDelivered: string;
  tech: string[];
};

const ENTRIES: ExperienceEntry[] = [
  {
    roleTitle: "Ingénieur Développement Fullstack .NET",
    organizationLabel: "SMEG, Monaco",
    period: "Nov. 2023 - Aujourd'hui",
    context:
      "Gestion des appels d'astreinte, d'urgence et interventions pour des usages bureau et mobile.",
    valueDelivered:
      "Conception et livraison d'une solution robuste, orientée fiabilité opérationnelle et réactivité terrain.",
    tech: [".NET 7", "C#", "ABP", "DDD", "Azure", "Docker", "RabbitMQ", "Redis", "MongoDB"],
  },
  {
    roleTitle: "Ingénieur Développement Fullstack .NET",
    organizationLabel: "Groupe C8G",
    period: "Juin 2023 - Aujourd'hui",
    context:
      "Développement de solutions web métier orientées usages internes et efficacité quotidienne.",
    valueDelivered:
      "Mise en production de fonctionnalités fullstack accélérant la livraison et la maintenabilité des produits.",
    tech: [".NET", "Blazor", "Entity Framework", "Azure", "Vue.js"],
  },
  {
    roleTitle: "Développeur Back-end .NET",
    organizationLabel: "TidyUp Technologies",
    period: "Juin 2023 - Oct. 2023",
    context:
      "Plateforme de rangement, classement et recherche de contenus numériques avec composante IA.",
    valueDelivered:
      "Construction d'un socle backend pérenne pour la recherche de contenus et l'évolution produit.",
    tech: [".NET MVC", ".NET Core", "C#", "Xamarin Forms", "SQL"],
  },
  {
    roleTitle: "Développeur Back-end .NET",
    organizationLabel: "UBALDI.com",
    period: "Avr. 2021 - Juin 2023",
    context: "Contribution à plusieurs projets internes orientés continuité de service et performance.",
    valueDelivered:
      "Fiabilisation du delivery backend et amélioration continue des processus techniques internes.",
    tech: [".NET", "C#", "API", "SQL Server"],
  },
  {
    roleTitle: "Développeur Fullstack .NET",
    organizationLabel: "Régie Eau d'Azur",
    period: "Sept. 2015 - Avr. 2021",
    context:
      "Réalisation de solutions applicatives internes sur un cycle long avec contraintes métier variées.",
    valueDelivered:
      "Industrialisation progressive des applications et renforcement de la qualité de service utilisateur.",
    tech: [".NET", "C#", "SQL", "Architecture applicative"],
  },
];

export function SectionWorkExperiences() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="experience-title" className={styles.title}>
            Expérience
          </h2>
          <p className={styles.subtitle}>
            Des missions réelles, menées de bout en bout, avec un focus constant sur la valeur livrée.
          </p>
        </header>

        <div className={styles.timeline}>
          {ENTRIES.map((entry) => (
            <article key={`${entry.roleTitle}-${entry.organizationLabel}-${entry.period}`} className={styles.card}>
              <p className={styles.period}>{entry.period}</p>
              <h3 className={styles.role}>{entry.roleTitle}</h3>
              <p className={styles.organization}>{entry.organizationLabel}</p>
              <p className={styles.blockLabel}>Contexte</p>
              <p className={styles.blockText}>{entry.context}</p>
              <p className={styles.blockLabel}>Valeur livrée</p>
              <p className={styles.blockText}>{entry.valueDelivered}</p>
              <ul className={styles.techList} aria-label="Technologies">
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
          Voir le parcours de formation
        </a>
      </div>
    </section>
  );
}
