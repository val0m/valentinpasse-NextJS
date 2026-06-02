import type { AppProps } from "next/app";
import { Archivo, Space_Grotesk } from "next/font/google";
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
  return (
    <div className={`${bodyFont.variable} ${displayFont.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
