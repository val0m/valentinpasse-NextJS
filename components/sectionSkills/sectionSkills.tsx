import React from "react";
import { PortfolioLocale } from "../../content/portfolioContent";
import styles from "./sectionSkills.module.scss";
import skillsData from "../../public/data/skills.json";
import {
  normalizeSkills,
  resolveSkillsSectionMetadata,
  SkillsLocale,
} from "./sectionSkills.extensions";

type SectionSkillsProps = {
  locale?: PortfolioLocale;
};

export function SectionSkills({ locale = "fr" }: SectionSkillsProps) {
  const metadata = resolveSkillsSectionMetadata(locale);
  const categories = normalizeSkills(skillsData, locale as SkillsLocale);

  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="skills-title" className={styles.title}>
            {metadata.title}
          </h2>
          <p className={styles.subtitle}>{metadata.subtitle}</p>
        </header>

        <div className={styles.diagram}>
          {categories.map((category) => (
            <div key={category.id} className={styles.node}>
              <div className={styles.nodeHead}>
                <div className={styles.nodeOrb} aria-hidden="true" />
                <div className={styles.nodeVline} aria-hidden="true" />
              </div>
              <div className={styles.nodeBody}>
                <h3 className={styles.nodeLabel}>{category.label}</h3>
                <p className={styles.nodeSupport}>{category.supportText}</p>
                <ul className={styles.chipList}>
                  {category.skills.map((skill) => (
                    <li
                      key={`${category.id}-${skill.label}`}
                      className={styles.chip}
                      title={skill.description ?? undefined}
                    >
                      {skill.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 ? <p className={styles.fallback}>{metadata.fallback}</p> : null}
      </div>
    </section>
  );
}
