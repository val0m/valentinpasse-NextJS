import React from "react";
import Link from "next/link";
import { Layout } from "../layout";
import { PortfolioLocale, getPortfolioContent, homePath } from "../../content/portfolioContent";
import styles from "./legalNotice.module.scss";

type LegalNoticePageProps = {
  locale: PortfolioLocale;
};

// Language variants of this page, shared by the FR (/mentions-legales) and
// EN (/legal-notice) routes so hreflang and the locale switcher stay correct.
const LOCALE_ALTERNATES = { fr: "/mentions-legales", en: "/legal-notice" };

export function LegalNoticePage({ locale }: LegalNoticePageProps) {
  const legal = getPortfolioContent(locale).legal;
  const homeHref = homePath(locale);
  const canonicalPath = LOCALE_ALTERNATES[locale];

  return (
    <Layout
      locale={locale}
      title={legal.metaTitle}
      description={legal.metaDescription}
      canonicalPath={canonicalPath}
      localeAlternates={LOCALE_ALTERNATES}
      secondary
    >
      <main id="main-content" className={styles.page}>
        <article className={styles.container}>
          <Link href={homeHref} className={styles.backLink}>
            {legal.backHomeLabel}
          </Link>
          <h1 className={styles.title}>{legal.pageTitle}</h1>
          <p className={styles.updated}>{legal.lastUpdated}</p>

          {legal.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              <div className={styles.rows}>
                {section.rows.map((row) =>
                  row.label ? (
                    <p key={row.label} className={styles.row}>
                      <span className={styles.rowLabel}>{row.label}</span>
                      <span className={styles.rowValue}>
                        {row.href ? (
                          <a href={row.href} className={styles.rowLink}>
                            {row.value}
                          </a>
                        ) : (
                          row.value
                        )}
                      </span>
                    </p>
                  ) : (
                    <p key={row.value} className={styles.paragraph}>
                      {row.value}
                    </p>
                  )
                )}
              </div>
            </section>
          ))}
        </article>
      </main>
    </Layout>
  );
}
