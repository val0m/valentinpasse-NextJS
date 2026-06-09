import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Archivo, Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "../components/googleAnalytics";
import { CookieConsentBanner } from "../components/cookieConsent";
import "../styles/globals.css";

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = router.pathname.startsWith("/en") ? "en" : "fr";

  return (
    <div className={`${bodyFont.variable} ${displayFont.variable}`}>
      <GoogleAnalytics />
      <Component {...pageProps} />
      <CookieConsentBanner locale={locale} />
    </div>
  );
}
