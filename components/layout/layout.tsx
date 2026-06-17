import Head from "next/head";
import React, { ReactNode } from "react";
import { HeaderCustom } from "../headerCustom";
import { FooterCustom } from "../footerCustom";
import { PortfolioLocale, portfolioEmail } from "../../content/portfolioContent";
import styles from "./layout.module.scss";

type LayoutProps = {
    children: ReactNode;
    locale: PortfolioLocale;
    title?: string;
    description?: string;
    canonicalPath?: string;
};

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

export function Layout({
    children,
    locale,
    title,
    description,
    canonicalPath = "/",
}: LayoutProps) {
    const resolvedTitle = title ?? DEFAULT_TITLES[locale];
    const resolvedDescription = description ?? DEFAULT_DESCRIPTIONS[locale];
    const ogLocale = locale === "en" ? "en_US" : "fr_FR";
    const alternateLocale = locale === "en" ? "fr_FR" : "en_US";
    const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
    const ogImageUrl = `${SITE_URL}${OG_IMAGE_PATH}`;
    const frUrl = SITE_URL;
    const enUrl = `${SITE_URL}/en`;

    const jsonLdPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Valentin PASSE",
        jobTitle: locale === "en" ? "Freelance Fullstack .NET Engineer" : "Freelance Fullstack .NET",
        url: SITE_URL,
        image: ogImageUrl,
        email: `mailto:${portfolioEmail}`,
        sameAs: [
            "https://github.com/val0m",
            "https://www.linkedin.com/in/valentin-passe/",
        ],
    };

    return (
        <div className={styles.mainContainer}>
            <Head>
                <meta charSet="utf-8" />
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
                <meta itemProp="name" content={resolvedTitle} />
                <meta itemProp="description" content={resolvedDescription} />
                <meta itemProp="image" content={ogImageUrl} />

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
                    dangerouslySetInnerHTML={{ __html: escapeJsonLd(jsonLdPerson) }}
                />
            </Head>

            <a href="#main-content" className={styles.skipLink}>
                {locale === "en" ? "Skip to content" : "Aller au contenu"}
            </a>

            <HeaderCustom locale={locale} />
            <div className={styles.content}>{children}</div>
            <FooterCustom locale={locale} />
        </div>
    );
}
