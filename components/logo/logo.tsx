import styles from "./logo.module.scss";

type LogoProps = {
  size?: number;
  className?: string;
  /**
   * Hides the logo from assistive tech, for spots where the brand name is
   * already written next to it (header, footer).
   */
  decorative?: boolean;
};

/**
 * The { >_ } logo: braces in the brand accent, prompt in currentColor so it
 * follows the surrounding text colour. Keep the paths in sync with
 * public/icon.svg (guarded by logo.test.tsx).
 */
export function Logo({ size = 32, className, decorative = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.logo} ${className ?? ""}`.trim()}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Valentin Passe"}
      aria-hidden={decorative || undefined}
    >
      <path d="M18 10 C12 10 10 13 10 18 V25 C10 29 8 32 5 32 C8 32 10 35 10 39 V46 C10 51 12 54 18 54" stroke="#8b5cf6" />
      <path d="M46 10 C52 10 54 13 54 18 V25 C54 29 56 32 59 32 C56 32 54 35 54 39 V46 C54 51 52 54 46 54" stroke="#8b5cf6" />
      <path d="M21 24 L29 32 L21 40 M33 40 H43" stroke="currentColor" />
    </svg>
  );
}
