import Head from "next/head";
import React, { ReactNode } from "react";
import { HeaderCustom } from "../headerCustom";
import { FooterCustom } from "../footerCustom";
import { PortfolioLocale, portfolioEmail } from "../../content/portfolioContent";
import styles from "./layout.module.scss";

type LocaleAlternates = {
    fr: string;
    en: string;
};

type LayoutProps = {
    children: ReactNode;
    locale: PortfolioLocale;
    title?: string;
    description?: string;
    canonicalPath?: string;
    /**
     * Paths (per locale) of the current page's language variants. Drives the
     * hreflang links and the header locale switcher. Defaults to the home pages.
     */
    localeAlternates?: LocaleAlternates;
    /**
     * Secondary pages (e.g. legal notice) are not the one-page home, so the
     * header navigates back to the home sections instead of scrolling in place.
     */
    secondary?: boolean;
};

const DEFAULT_LOCALE_ALTERNATES: LocaleAlternates = { fr: "/", en: "/en" };

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.valentin-passe.com").replace(/\/+$/, "");
const OG_IMAGE_PATH = "/og-image.jpg";

function escapeJsonLd(value: unknown): string {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

const DEFAULT_TITLES: Record<PortfolioLocale, string> = {
    fr: "Valentin PASSE | Freelance Fullstack .NET",
    en: "Valentin PASSE | Freelance Fullstack .NET Engineer",
};

const DEFAULT_DESCRIPTIONS: Record<PortfolioLocale, string> = {
    fr: "Portfolio de Valentin PASSE, freelance Fullstack .NET (Blazor, C#, Azure).",
    en: "Portfolio of Valentin PASSE, freelance Fullstack .NET engineer (Blazor, C#, Azure).",
};

// Locale-independent structured-data facts for the Person entity.
const PERSON_KNOWS_ABOUT = [
    ".NET",
    "C#",
    "ASP.NET Core",
    "Blazor",
    ".NET MAUI",
    "Clean Architecture",
    "Domain-Driven Design",
    "CQRS",
    "Microsoft Azure",
    "PostgreSQL",
    "Docker",
    "AI integration",
];

const PERSON_ALUMNI_OF = [
    { "@type": "EducationalOrganization", name: "IUT Nice Sophia Antipolis" },
    { "@type": "EducationalOrganization", name: "Lycée Honoré d'Estienne d'Orves" },
];

const PERSON_JOB_TITLE: Record<PortfolioLocale, string> = {
    fr: "Freelance Fullstack .NET",
    en: "Freelance Fullstack .NET Engineer",
};

const PERSON_OCCUPATION_NAME: Record<PortfolioLocale, string> = {
    fr: "Ingénieur Fullstack .NET freelance",
    en: "Freelance Fullstack .NET Engineer",
};

export function Layout({
    children,
    locale,
    title,
    description,
    canonicalPath = "/",
    localeAlternates = DEFAULT_LOCALE_ALTERNATES,
    secondary = false,
}: LayoutProps) {
    const resolvedTitle = title ?? DEFAULT_TITLES[locale];
    const resolvedDescription = description ?? DEFAULT_DESCRIPTIONS[locale];
    const ogLocale = locale === "en" ? "en_US" : "fr_FR";
    const alternateLocale = locale === "en" ? "fr_FR" : "en_US";
    const toAbsolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
    const canonicalUrl = toAbsolute(canonicalPath);
    const ogImageUrl = `${SITE_URL}${OG_IMAGE_PATH}`;
    const frUrl = toAbsolute(localeAlternates.fr);
    const enUrl = toAbsolute(localeAlternates.en);
    // On secondary pages the header switches language by jumping to the other
    // locale's variant of this same page rather than the home root.
    const localeSwitchHref = locale === "fr" ? localeAlternates.en : localeAlternates.fr;

    const personId = `${SITE_URL}/#person`;
    const websiteId = `${SITE_URL}/#website`;

    const jsonLdGraph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": websiteId,
                url: SITE_URL,
                name: "Valentin PASSE",
                inLanguage: ["fr", "en"],
                author: { "@id": personId },
            },
            {
                "@type": "ProfilePage",
                "@id": `${canonicalUrl}#profilepage`,
                url: canonicalUrl,
                name: resolvedTitle,
                description: resolvedDescription,
                inLanguage: locale,
                isPartOf: { "@id": websiteId },
                mainEntity: { "@id": personId },
            },
            {
                "@type": "Person",
                "@id": personId,
                name: "Valentin PASSE",
                givenName: "Valentin",
                familyName: "PASSE",
                jobTitle: PERSON_JOB_TITLE[locale],
                description: resolvedDescription,
                url: SITE_URL,
                email: portfolioEmail,
                image: {
                    "@type": "ImageObject",
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                },
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "Nice",
                    postalCode: "06200",
                    addressRegion: "Provence-Alpes-Côte d'Azur",
                    addressCountry: "FR",
                },
                knowsAbout: PERSON_KNOWS_ABOUT,
                alumniOf: PERSON_ALUMNI_OF,
                hasOccupation: {
                    "@type": "Occupation",
                    name: PERSON_OCCUPATION_NAME[locale],
                    occupationLocation: { "@type": "City", name: "Nice" },
                    skills: ".NET, C#, Blazor, .NET MAUI, Azure, Clean Architecture, DDD, CQRS",
                },
                sameAs: [
                    "https://github.com/val0m",
                    "https://www.linkedin.com/in/valentin-passe/",
                ],
            },
        ],
    };

    return (
        <div className={styles.mainContainer}>
            <Head>
                <meta charSet="utf-8" />

                {/*
                  Warm up the cross-origin connection to prod.spline.design as early
                  as possible in the head: the 3D hero (home pages only) loads the
                  Spline WebGL runtime + a remote scene from there at first paint.
                  crossOrigin is required so the preconnected socket is reused for the
                  scene's CORS fetch; dns-prefetch is a legacy fallback. Skipped on
                  secondary pages (legal), which never render the hero.
                */}
                {!secondary && (
                    <>
                        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
                        <link rel="dns-prefetch" href="https://prod.spline.design" />
                    </>
                )}

                <meta name="author" content="Valentin PASSE" />
                <meta name="copyright" content="Portfolio of Valentin PASSE" />
                <meta
                    name="keywords"
                    content="Valentin Passe, Portfolio, Fullstack .NET, Blazor, C#, Azure, freelance, software delivery"
                />
                <meta name="description" content={resolvedDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index,follow" />
                <meta name="theme-color" content="#18181b" />

                <meta property="og:title" content={resolvedTitle} />
                <meta property="og:description" content={resolvedDescription} />
                <meta property="og:site_name" content="Valentin PASSE" />
                <meta property="og:locale" content={ogLocale} />
                <meta property="og:locale:alternate" content={alternateLocale} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={ogImageUrl} />
                <meta property="og:image:alt" content="Valentin PASSE" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={resolvedTitle} />
                <meta name="twitter:description" content={resolvedDescription} />
                <meta name="twitter:image" content={ogImageUrl} />
                <meta name="twitter:image:alt" content="Valentin PASSE" />

                <link rel="canonical" href={canonicalUrl} />
                <link rel="alternate" hrefLang="fr" href={frUrl} />
                <link rel="alternate" hrefLang="en" href={enUrl} />
                <link rel="alternate" hrefLang="x-default" href={frUrl} />

                <title>{resolvedTitle}</title>
                <link rel="icon" href="/favicon.ico" />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: escapeJsonLd(jsonLdGraph) }}
                />
            </Head>

            <a href="#main-content" className={styles.skipLink}>
                {locale === "en" ? "Skip to content" : "Aller au contenu"}
            </a>

            <HeaderCustom
                locale={locale}
                secondary={secondary}
                localeSwitchHref={secondary ? localeSwitchHref : undefined}
            />
            <div className={styles.content}>{children}</div>
            <FooterCustom locale={locale} />
        </div>
    );
}
