import type { AppProps } from "next/app";
import { Manrope, Space_Grotesk } from "next/font/google";
import "../styles/globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${bodyFont.variable} ${displayFont.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
