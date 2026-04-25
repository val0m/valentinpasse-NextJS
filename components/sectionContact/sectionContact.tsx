import React, { useState } from "react";
import { PortfolioLocale, getPortfolioContent, portfolioEmail } from "../../content/portfolioContent";
import styles from "./sectionContact.module.scss";

type SectionContactProps = {
  locale?: PortfolioLocale;
};

export function SectionContact({ locale = "fr" }: SectionContactProps) {
  const content = getPortfolioContent(locale).contact;
  const [feedback, setFeedback] = useState<string>("");

  const handleCopyEmail = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setFeedback(content.copyUnavailable);
      return;
    }

    try {
      await navigator.clipboard.writeText(portfolioEmail);
      setFeedback(content.copySuccess);
    } catch {
      setFeedback(content.copyError);
    }
  };

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.container}>
        <h2 id="contact-title" className={styles.title}>
          {content.title}
        </h2>
        <p className={styles.description}>{content.description}</p>
        <p className={styles.responsePromise}>{content.responsePromise}</p>

        <ul className={styles.inquiryList} aria-label="Types de demandes">
          {content.inquiryTypes.map((item) => (
            <li key={item} className={styles.inquiryItem}>
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <a
            href={`mailto:${portfolioEmail}`}
            className={styles.primaryAction}
            aria-label="Envoyer un e-mail à Valentin Passe"
          >
            {content.primaryActionLabel}
          </a>

          <button
            type="button"
            className={styles.secondaryAction}
            onClick={handleCopyEmail}
            aria-label="Copier l'adresse e-mail"
          >
            {content.copyActionLabel}
          </button>
        </div>

        <p className={styles.emailText}>
          {content.emailLabel}: <a href={`mailto:${portfolioEmail}`}>{portfolioEmail}</a>
        </p>
        <p className={styles.meta}>{content.meta}</p>
        <p className={styles.feedback} role="status" aria-live="polite">
          {feedback}
        </p>
      </div>
    </section>
  );
}
