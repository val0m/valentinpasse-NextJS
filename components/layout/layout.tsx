import PropTypes from "prop-types";
import Head from "next/head";
import React, { ReactNode } from "react";
import { HeaderCustom } from "../headerCustom";
import { FooterCustom } from "../footerCustom";
import { PortfolioLocale } from "../../content/portfolioContent";
import styles from "./layout.module.scss";

type LayoutProps = {
    children: ReactNode;
    locale: PortfolioLocale;
    title?: string;
    description?: string;
};

export function Layout({
    children,
    locale,
    title = "Valentin PASSE | Freelance Fullstack .NET",
    description = "Portfolio de Valentin PASSE, freelance Fullstack .NET.",
}: LayoutProps) {
    const ogLocale = locale === "en" ? "en_US" : "fr_FR";

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
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index,follow" />
                <meta itemProp="name" content={title} />
                <meta itemProp="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:site_name" content="Valentin PASSE" />
                <meta property="og:locale" content={ogLocale} />
                <meta property="og:type" content="website" />
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HeaderCustom locale={locale} />
            <div className={styles.content}>{children}</div>
            <FooterCustom locale={locale} />
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};