import React from "react";
import styles from "./sectionSkills.module.scss";
import skillsData from "../../public/data/skills.json";
import {
  normalizeSkills,
  resolveSkillsSectionMetadata,
  SkillsLocale,
} from "./sectionSkills.extensions";

export function SectionSkills() {
  const locale: SkillsLocale = "fr";
  const metadata = resolveSkillsSectionMetadata(locale);
  const categories = normalizeSkills(skillsData);

  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="skills-title" className={styles.title}>
            {metadata.title}
          </h2>
          <p className={styles.subtitle}>{metadata.subtitle}</p>
        </header>

        <div className={styles.grid}>
          {categories.map((category) => (
            <article key={category.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{category.label}</h3>
              <p className={styles.cardSupport}>{category.supportText}</p>

              <ul className={styles.skillsList}>
                {category.skills.map((skill) => (
                  <li key={`${category.id}-${skill.label}`} className={styles.skillItem}>
                    <p className={styles.skillLabel}>{skill.label}</p>
                    {skill.description ? (
                      <p className={styles.skillDescription}>{skill.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {categories.length === 0 ? <p className={styles.fallback}>{metadata.fallback}</p> : null}
      </div>
    </section>
  );
}
