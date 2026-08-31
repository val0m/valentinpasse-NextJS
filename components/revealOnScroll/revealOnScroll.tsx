import React, { useEffect, useRef, useState } from "react";
import styles from "./revealOnScroll.module.scss";

type RevealOnScrollProps = {
  children: React.ReactNode;
  /** Optional extra class merged onto the wrapper. */
  className?: string;
  /** Entrance delay in ms (kept within the spec's 120–600ms motion window). */
  delayMs?: number;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Reveals its children (fade + small upward translate) the first time they
 * enter the viewport — the spec's `SectionRevealWrapper`.
 *
 * Resilient by design: the children are always in the DOM and fully readable.
 * The hidden pre-reveal state is applied *only after* JS mounts and *only* when
 * the section is reported off-screen, so with JS disabled,
 * `prefers-reduced-motion`, or no `IntersectionObserver` support the section
 * simply renders visible with no animation. Content never depends on the
 * animation running. State is set only from the observer callback (an external
 * subscription), never synchronously in the effect body.
 */
export function RevealOnScroll({ children, className, delayMs = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    // Never hide content we cannot safely animate back into view.
    if (prefersReducedMotion() || typeof IntersectionObserver !== "function") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // On screen (incl. the initial report for above-the-fold sections):
          // reveal and stop observing.
          setVisible(true);
          observer.disconnect();
        } else {
          // Reported off-screen first: arm the hidden state so it animates in
          // once the visitor scrolls to it.
          setArmed(true);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const wrapperClassName =
    [className, armed ? styles.reveal : "", visible ? styles.visible : ""]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div
      ref={ref}
      className={wrapperClassName}
      style={armed && delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
