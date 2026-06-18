import React from "react";
import Image from "next/image";
import Logo from "../../public/images/header/logo.webp";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "./headerCustom.module.scss";

type HeaderCustomProps = {
  locale: PortfolioLocale;
  /**
   * When true, the header belongs to a secondary page (not the one-page home):
   * nav links navigate back to the home sections instead of scrolling in place.
   */
  secondary?: boolean;
  /** Overrides the locale switcher target (used by secondary pages). */
  localeSwitchHref?: string;
};

export function HeaderCustom({ locale, secondary = false, localeSwitchHref }: HeaderCustomProps) {
  const content = React.useMemo(() => getPortfolioContent(locale), [locale]);
  const navItems = React.useMemo(
    () => content.navigation.items.map((item) => ({ ...item, route: `#${item.id}` })),
    [content.navigation.items]
  );
  const navItemIds = React.useMemo(() => navItems.map((item) => item.id), [navItems]);
  const [activeSectionId, setActiveSectionId] = React.useState<string>("hero");
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
  const [notice, setNotice] = React.useState<string>("");
  const otherLocaleHref = `${locale === "fr" ? "/en" : "/"}#${activeSectionId || "hero"}`;
  const homeBase = locale === "en" ? "/en" : "/";
  const resolvedLocaleSwitchHref = localeSwitchHref ?? otherLocaleHref;
  // Over the hero the header stays transparent so the 3D scene shows through;
  // a solid backdrop appears once scrolled (or while the mobile menu is open)
  // to keep the nav readable above the lighter content sections. Secondary
  // pages (e.g. legal notice) have no dark hero, so the backdrop is always on
  // to keep the light-on-dark nav legible against their light background.
  const hasBackdrop = isScrolled || isMenuOpen || secondary;

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const ids = navItemIds;
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
  }, [navItemIds]);

  const handleAnchorNavigation = (event: React.MouseEvent<HTMLAnchorElement>, route: string, id: string) => {
    if (typeof window === "undefined") {
      return;
    }

    event.preventDefault();
    const target = document.querySelector(route);
    if (!target) {
      setNotice(
        locale === "en"
          ? "The requested section is temporarily unavailable. You can continue browsing."
          : "La section demandée est temporairement indisponible. Vous pouvez continuer votre navigation."
      );
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
    <header className={`${styles.header} ${hasBackdrop ? styles.headerScrolled : ""}`.trim()}>
      <nav className={styles.nav} aria-label={content.navigation.mainNavAriaLabel}>
        <a
          href={secondary ? homeBase : "#hero"}
          className={styles.brand}
          onClick={secondary ? undefined : (event) => handleAnchorNavigation(event, "#hero", "hero")}
        >
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
                  href={secondary ? `${homeBase}${item.route}` : item.route}
                  className={`${styles.navLink} ${!secondary && activeSectionId === item.id ? styles.navLinkActive : ""}`.trim()}
                  aria-current={!secondary && activeSectionId === item.id ? "page" : undefined}
                  onClick={secondary ? undefined : (event) => handleAnchorNavigation(event, item.route, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.utilityGroup}>
            <a
              href={resolvedLocaleSwitchHref}
              className={styles.localeSwitch}
              aria-label={content.navigation.localeSwitcherLabel}
            >
              {content.switchLocaleLabel}
            </a>
            <a
              href={secondary ? `${homeBase}#contact` : "#contact"}
              className={styles.contactCta}
              onClick={secondary ? undefined : (event) => handleAnchorNavigation(event, "#contact", "contact")}
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