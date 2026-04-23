import React, { useState } from "react";
import styles from "./sectionContact.module.scss";

const CONTACT_EMAIL = "passe.valentin@gmail.com";

const INQUIRY_TYPES = [
  "Création ou refonte d'application web .NET",
  "Renfort Fullstack sur produit existant",
  "Audit technique et plan de delivery",
];

export function SectionContact() {
  const [feedback, setFeedback] = useState<string>("");

  const handleCopyEmail = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setFeedback("Copie non disponible. Utilisez l'adresse e-mail affichée ci-dessous.");
      return;
    }

    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setFeedback("Adresse e-mail copiée.");
    } catch {
      setFeedback("Impossible de copier l'adresse automatiquement. Copiez-la manuellement.");
    }
  };

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.container}>
        <h2 id="contact-title" className={styles.title}>
          Contact
        </h2>
        <p className={styles.description}>
          Dites-moi ce que vous souhaitez livrer et je vous réponds rapidement.
          Je suis disponible pour des missions freelance .NET en remote, hybride
          ou sur site.
        </p>

        <ul className={styles.inquiryList} aria-label="Types de demandes">
          {INQUIRY_TYPES.map((item) => (
            <li key={item} className={styles.inquiryItem}>
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={styles.primaryAction}
            aria-label="Envoyer un e-mail à Valentin Passe"
          >
            Me contacter
          </a>

          <button
            type="button"
            className={styles.secondaryAction}
            onClick={handleCopyEmail}
            aria-label="Copier l'adresse e-mail"
          >
            Copier l'adresse e-mail
          </button>
        </div>

        <p className={styles.emailText}>
          Email direct: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p className={styles.meta}>Nice, Provence-Alpes-Côte d'Azur · LinkedIn disponible sur demande</p>
        <p className={styles.feedback} role="status" aria-live="polite">
          {feedback}
        </p>
      </div>
    </section>
  );
}
