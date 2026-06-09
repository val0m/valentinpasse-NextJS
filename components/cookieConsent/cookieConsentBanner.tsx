import { PortfolioLocale } from "../../content/portfolioContent";
import { useConsent } from "./consentStore";
import styles from "./cookieConsentBanner.module.scss";

type BannerCopy = {
    text: string;
    accept: string;
    decline: string;
    aria: string;
};

const COPY: Record<PortfolioLocale, BannerCopy> = {
    fr: {
        text: "Ce site utilise des cookies de mesure d'audience (Google Analytics) pour comprendre sa fréquentation. Aucun cookie n'est déposé sans votre accord.",
        accept: "Accepter",
        decline: "Continuer sans accepter",
        aria: "Consentement aux cookies de mesure d'audience",
    },
    en: {
        text: "This site uses audience-measurement cookies (Google Analytics) to understand its traffic. No cookie is set without your consent.",
        accept: "Accept",
        decline: "Continue without accepting",
        aria: "Consent to audience-measurement cookies",
    },
};

export function CookieConsentBanner({ locale }: { locale: PortfolioLocale }) {
    const { consent, accept, decline } = useConsent();

    // On n'affiche le bandeau que si aucun choix n'a encore été fait.
    if (consent !== null) {
        return null;
    }

    const copy = COPY[locale];

    return (
        <div
            className={styles.banner}
            role="region"
            aria-label={copy.aria}
        >
            <p className={styles.text}>{copy.text}</p>
            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.decline}
                    onClick={decline}
                >
                    {copy.decline}
                </button>
                <button
                    type="button"
                    className={styles.accept}
                    onClick={accept}
                >
                    {copy.accept}
                </button>
            </div>
        </div>
    );
}
