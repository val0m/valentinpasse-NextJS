// Libs
import PropTypes from "prop-types";
import Head from "next/head";
import React, {ReactNode} from 'react';
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { AppProps } from 'next/app';
// import { Analytics } from '@vercel/analytics/react';

// Components
import { HeaderCustom } from '../headerCustom/HeaderCustom';
import { FooterCustom } from '../footerCustom/FooterCustom';

//CSS Module
import styles from "./Layout.module.scss";
import Image from "next/image";

type LayoutProps = {
    children: ReactNode;
    title?: string;
};

export default function Layout ({
    children,
    title = 'Développeur informatique .NET - Valentin PASSE'
    } : LayoutProps) 
{    
    return (
        <div className={styles["main-container"]}>
            <Head>
                <meta charSet="utf-8" />
                <meta name="acharSet=thor" content="Valentin PASSE" />
                <meta name="author" content="Valentin PASSE" />
                <meta name="copyright" content="Portfolio of Valentin PASSE" />
                <meta name="keywords" content="Valentin Passé, Valentin Passe, Portfolio, Web Developer, Développeur Web, Informatique, Web, .Net, C#, NextJS, Developer .Net, Backend, Frontend, freelance, autoentrepreneur" />
                <meta name="description" content="Portfolio de Valentin PASSE. Développeur Web spécialisé dans la technologie Microsoft et les nouvelles technologies." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="Valentin Passé, Valentin Passe, Portfolio, Web Developer, Développeur Web, Web, Développeur informatique" />

                <meta itemProp="name" content="Valentin PASSE - Portfolio professionnel - Développeur informatique" />
                <meta itemProp="description" content="Porfolio de Valentin PASSE, développeur web en auto-entrepreneur." />
                <meta itemProp="image" content="https://valentin-passe.com" />
                
                <meta property="og:title" content="Valentin PASSE - Portfolio professionnel - Développeur informatique" />
                <meta property="og:description" content="Porfolio de Valentin PASSE, développeur web en auto-entrepreneur." />
                <meta property="og:image" content="https://valentin-passe.com/assets/images/home/image1.webp" />
                <meta property="og:url" content="https://valentin-passe.com" />
                <meta property="og:site_name" content="Développeur .NET - Valentin PASSE" />
                <meta property="og:locale" content="fr_FR" />
                <meta property="og:type" content="website" />

                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="robots" content="Valentin Passé, Valentin Passe, Portfolio, Web Developer, Développeur Web, Web" />
                <meta name="author" content="Passé Valentin" />

                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HeaderCustom />
            <main>
                {children}
                {/* <Analytics /> */}
            </main>

            <FooterCustom />            
        </div>
    )
}

Layout.propTypes = {
    /**
     * page content
     */
    children: PropTypes.node.isRequired,
}