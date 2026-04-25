import React from "react";
import Image from "next/image";
import Logo from "../../public/images/header/logo.webp";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "./headerCustom.module.scss";

type HeaderCustomProps = {
  locale: PortfolioLocale;
};

export function HeaderCustom({ locale }: HeaderCustomProps) {
  const content = getPortfolioContent(locale);
  const navItems = content.navigation.items.map((item) => ({
    ...item,
    route: `#${item.id}`,
  }));
  const [activeSectionId, setActiveSectionId] = React.useState<string>("hero");
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [notice, setNotice] = React.useState<string>("");
  const otherLocaleHref = `${locale === "fr" ? "/en" : "/"}#${activeSectionId || "hero"}`;

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const ids = navItems.map((item) => item.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visible.length > 0) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-20% 0px -60% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    const updateFromHash = () => {
      const hashId = window.location.hash.replace("#", "");
      if (hashId && ids.includes(hashId)) {
        setActiveSectionId(hashId);
      }
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, []);

  const handleAnchorNavigation = (event: React.MouseEvent<HTMLAnchorElement>, route: string, id: string) => {
    if (typeof window === "undefined") {
      return;
    }

    event.preventDefault();
    const target = document.querySelector(route);
    if (!target) {
      setNotice("La section demandee est temporairement indisponible. Vous pouvez continuer votre navigation.");
      setIsMenuOpen(false);
      return;
    }

    setNotice("");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", route);
    setActiveSectionId(id);
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navigation principale">
        <a href="#hero" className={styles.brand} onClick={(event) => handleAnchorNavigation(event, "#hero", "hero")}>
          <Image src={Logo} width={44} height={52} alt="Logo Valentin PASSE" />
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Valentin Passe</span>
            <span className={styles.brandSubtitle}>Fullstack .NET</span>
          </span>
        </a>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={isMenuOpen}
          aria-controls="portfolio-navigation"
          aria-label={locale === "fr" ? "Ouvrir ou fermer le menu" : "Open or close menu"}
          onClick={() => setIsMenuOpen((previous) => !previous)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="portfolio-navigation"
          className={`${styles.navPanel} ${isMenuOpen ? styles.navPanelOpen : ""}`.trim()}
        >
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.route}
                  className={`${styles.navLink} ${activeSectionId === item.id ? styles.navLinkActive : ""}`.trim()}
                  aria-current={activeSectionId === item.id ? "page" : undefined}
                  onClick={(event) => handleAnchorNavigation(event, item.route, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.utilityGroup}>
            <a
              href={otherLocaleHref}
              className={styles.localeSwitch}
              aria-label={content.navigation.localeSwitcherLabel}
            >
              {content.switchLocaleLabel}
            </a>
            <a
              href="#contact"
              className={styles.contactCta}
              onClick={(event) => handleAnchorNavigation(event, "#contact", "contact")}
            >
              {content.navigation.ctaLabel}
            </a>
          </div>
        </div>
      </nav>

      <p className={styles.notice} role="status" aria-live="polite">
        {notice}
      </p>
    </header>
  );
}