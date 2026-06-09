import Script from "next/script";
import { useConsent } from "../cookieConsent";

// Le Measurement ID GA4 est fourni exclusivement par l'environnement
// (NEXT_PUBLIC_GA_ID) afin de ne pas le versionner dans le dépôt.
// Note : cette variable est inlinée au build Next.js — elle doit donc être
// présente lors du `next build`, pas seulement au runtime.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// L'analytics n'est éligible qu'en production (pour ne pas polluer les
// statistiques avec le trafic de développement) et si un ID est configuré.
const isAnalyticsConfigured =
    process.env.NODE_ENV === "production" && Boolean(GA_MEASUREMENT_ID);

export function GoogleAnalytics() {
    const { consent } = useConsent();

    // GA n'est chargé qu'après consentement explicite (conformité CNIL/RGPD).
    // Le site étant statique avec rechargement complet entre les pages
    // (y compris la bascule FR/EN), GA4 compte chaque vue à l'initialisation :
    // aucun suivi de navigation côté client n'est nécessaire.
    const isEnabled = isAnalyticsConfigured && consent === "granted";

    if (!isEnabled) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}');
                `}
            </Script>
        </>
    );
}
