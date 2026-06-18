import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoHeader from "../../public/images/header/logo.webp";
import { PortfolioLocale, getPortfolioContent, portfolioEmail, homePath } from "../../content/portfolioContent";
import styles from "./footerCustom.module.scss";

type FooterCustomProps = {
  locale: PortfolioLocale;
};

export function FooterCustom({ locale }: FooterCustomProps) {
  const content = getPortfolioContent(locale).footer;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandColumn}>
          <Link href={homePath(locale)} className={styles.brandLink}>
            <Image src={LogoHeader} width={56} height={66} alt="Logo du portfolio de Valentin PASSE" />
            <div>
              <p className={styles.brandTitle}>Valentin Passe</p>
              <p className={styles.brandBaseline}>{content.baseline}</p>
            </div>
          </Link>
          <p className={styles.availability}>{content.availability}</p>
        </div>

        <div className={styles.linksColumn}>
          <p className={styles.columnTitle}>{content.navigationTitle}</p>
          <ul className={styles.linkList}>
            {content.links.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.contactColumn}>
          <p className={styles.columnTitle}>{content.contactTitle}</p>
          <a href={`mailto:${portfolioEmail}`} className={styles.emailLink}>
            {portfolioEmail}
          </a>
          <p className={styles.rights}>{content.rights}</p>
          <Link href={content.legalLink.href} className={styles.legalLink}>
            {content.legalLink.label}
          </Link>
        </div>
      </div>
    </footer>
  );
}