import React from "react";
import styles from "./sectionContact.module.scss";

export function SectionContact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.container}>
        <h2 id="contact-title" className={styles.title}>Contact</h2>
        <p className={styles.description}>
          Discutons de votre projet. Je suis disponible pour des missions
          freelance fullstack .NET.
        </p>

        <div className={styles.actions}>
          <a
            href="mailto:contact@valentin-passe.com"
            className={styles.primaryAction}
            aria-label="Envoyer un e-mail à Valentin Passe"
          >
            Me contacter
          </a>
          <a
            href="/images/resume/valentin-passe.webp"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryAction}
            aria-label="Télécharger le CV de Valentin Passe"
          >
            Télécharger le CV
          </a>
        </div>
      </div>
    </section>
  );
}
