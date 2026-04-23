import React from "react";
import styles from "./trustSignals.module.scss";

export type TrustSignalItem = {
  label: string;
  supportingText: string;
  ctaLabel?: string;
  ctaTarget?: string;
};

type TrustSignalsProps = {
  title: string;
  items: TrustSignalItem[];
  placement: "hero" | "about" | "services" | "experience" | "projects" | "contact";
  compact?: boolean;
};

export function TrustSignals({ title, items, placement, compact = false }: TrustSignalsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={`${styles.panel} ${compact ? styles.compact : ""}`.trim()}
      aria-label={`Réassurance ${placement}`}
    >
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={`${placement}-${item.label}`} className={styles.item}>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.supportingText}>{item.supportingText}</p>
            {item.ctaLabel && item.ctaTarget ? (
              <a href={item.ctaTarget} className={styles.cta}>
                {item.ctaLabel}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
