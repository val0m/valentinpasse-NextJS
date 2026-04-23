import React from "react";
import styles from "./sectionProjects.module.scss";
import { TrustSignals } from "../trustSignals";

type ProjectEntry = {
  title: string;
  summary: string;
  context: string;
  contribution: string;
  outcome: string;
  tags: string[];
  publicLink?: string;
};

const PROJECTS: ProjectEntry[] = [
  {
    title: "Astreinte et interventions (SMEG)",
    summary:
      "Solution métier pour piloter appels d'astreinte, urgences et interventions sur usages bureau et mobile.",
    context:
      "Environnement opérationnel exigeant, avec contraintes de disponibilité et qualité de service continue.",
    contribution:
      "Conception et développement Fullstack sur socle .NET 7 / ABP, avec architecture orientée domaine.",
    outcome:
      "Digitalisation des processus terrain et meilleure réactivité des équipes dans les situations critiques.",
    tags: [".NET", "C#", "ABP", "DDD", "Azure", "MongoDB"],
  },
  {
    title: "Plateforme backend avec composante IA (TidyUp)",
    summary:
      "Base applicative pour le rangement, classement et la recherche de contenus numériques à forte valeur.",
    context:
      "Besoin d'une fondation backend robuste pour supporter l'évolution des fonctionnalités IA dans le temps.",
    contribution:
      "Développement backend en .NET MVC / .NET Core, structuration des flux techniques et de la persistance.",
    outcome:
      "Socle technique pérenne facilitant la montée en capacité produit et la fiabilité des traitements.",
    tags: [".NET MVC", ".NET Core", "C#", "SQL", "Architecture"],
  },
  {
    title: "Applications internes d'entreprise",
    summary:
      "Plusieurs projets internes menés sur des cycles longs pour soutenir les besoins métiers quotidiens.",
    context:
      "Contexte multi-applications avec enjeux de maintenabilité, performance et évolution progressive.",
    contribution:
      "Développement backend/fullstack, maintenance évolutive et amélioration continue de la qualité de delivery.",
    outcome:
      "Fiabilisation des processus internes et meilleure continuité de service pour les utilisateurs métiers.",
    tags: [".NET", "Blazor", "Entity Framework", "SQL Server", "Delivery"],
    publicLink: "https://c8g.fr",
  },
];

export function SectionProjects() {
  const projectTrustSignals = [
    {
      label: "Resultats relies a des contextes reels",
      supportingText:
        "Chaque projet expose contexte, contribution et impact pour faciliter une evaluation concrete.",
      ctaLabel: "Demander un echange cible",
      ctaTarget: "#contact",
    },
    {
      label: "Technologies explicites",
      supportingText:
        "Les stacks affichees sont alignees avec les sections competences et experience.",
      ctaLabel: "Verifier les competences",
      ctaTarget: "#skills",
    },
  ];

  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="projects-title" className={styles.title}>
            Projets
          </h2>
          <p className={styles.subtitle}>
            Des cas concrets qui montrent comment je transforme un contexte métier en livraison utile.
          </p>
        </header>

        <div className={styles.grid}>
          {PROJECTS.map((project) => (
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
                  Voir un lien public
                </a>
              ) : null}
            </article>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <a href="#contact" className={styles.primaryCta}>
            Discuter de votre projet
          </a>
          <a href="#contact" className={styles.secondaryCta}>
            Demander le CV
          </a>
        </div>

        <TrustSignals
          title="Elements de decision"
          items={projectTrustSignals}
          placement="projects"
        />
      </div>
    </section>
  );
}
