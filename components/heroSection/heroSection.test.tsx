import fs from "fs";
import path from "path";
import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./heroSection";
import { getPortfolioContent } from "../../content/portfolioContent";
import {
  NO_PREFERENCE,
  REDUCED_MOTION,
  mockMatchMedia,
} from "../../lib/testing/mockMatchMedia";

const heroStyles = fs.readFileSync(path.join(__dirname, "heroSection.module.scss"), "utf8");

describe("HeroSection", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockMatchMedia(NO_PREFERENCE);
  });

  it("renders English headline, actions and metrics when locale is 'en'", () => {
    render(<HeroSection locale="en" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Valentin Passe" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Main actions")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View projects" })).toBeInTheDocument();
    expect(screen.getByText("years of software development")).toBeInTheDocument();
  });

  it("renders French headline, actions and metrics when locale is 'fr'", () => {
    render(<HeroSection locale="fr" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Valentin Passe" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Actions principales")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voir les projets" })).toBeInTheDocument();
    expect(screen.getByText("ans de développement logiciel")).toBeInTheDocument();
  });

  it("resolves both localized CTA targets to existing sections", () => {
    (["fr", "en"] as const).forEach((locale) => {
      const { unmount } = render(<HeroSection locale={locale} />);
      const hero = getPortfolioContent(locale).hero;

      expect(screen.getByRole("link", { name: hero.primaryAction.label })).toHaveAttribute(
        "href",
        "#contact"
      );
      expect(screen.getByRole("link", { name: hero.secondaryAction.label })).toHaveAttribute(
        "href",
        "#projects"
      );
      unmount();
    });
  });

  it("mounts a single decorative 2D network canvas and no WebGL surface", () => {
    const { container } = render(<HeroSection locale="fr" />);

    const canvases = container.querySelectorAll("#hero canvas");
    expect(canvases).toHaveLength(1);
    expect(canvases[0]).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("[class*='spline']")).toBeNull();
  });

  it("paints the network behind the copy, never over it", () => {
    const { container } = render(<HeroSection locale="fr" />);
    const section = container.querySelector("#hero") as HTMLElement;

    // Source order backs up the z-index: the canvas comes before the copy block.
    expect(section.firstElementChild?.tagName).toBe("CANVAS");
  });

  it("binds no scroll listener under prefers-reduced-motion", () => {
    mockMatchMedia(REDUCED_MOTION);
    const addEventListener = jest.spyOn(window, "addEventListener");

    render(<HeroSection locale="fr" />);

    expect(addEventListener.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(0);
  });

  describe("stylesheet regressions", () => {
    it("never animates the block holding the h1, the LCP candidate", () => {
      // `animation: … both` used to hold .content — and therefore the <h1> — at
      // opacity 0 until the animation started, delaying the largest paint.
      const contentRule = heroStyles.match(/^\.content \{([\s\S]*?)^\}/m)?.[1];

      expect(contentRule).toBeDefined();
      // Comments may legitimately mention the removed animation.
      expect(contentRule?.replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/animation/);
    });

    it("sizes the hero below a full viewport so the projects band peeks above the fold", () => {
      expect(heroStyles).not.toMatch(/min-height:\s*100vh/);
      expect(heroStyles).toMatch(/min-height:\s*clamp\(560px,\s*82svh,\s*900px\)/);
    });

    it("keeps the network canvas out of the pointer's way", () => {
      // The canvas lies over the whole section; it must never swallow clicks
      // meant for the CTAs, nor sit above the copy.
      const networkRule = heroStyles.match(/^\.network \{([\s\S]*?)^\}/m)?.[1];

      expect(networkRule).toBeDefined();
      expect(networkRule).toMatch(/pointer-events:\s*none;/);
      expect(networkRule).toMatch(/z-index:\s*0;/);
    });

    it("fades both the hero surface and the network out over the same bottom band", () => {
      // A hard bottom edge would cut the network lines and show a seam against
      // the page background the next section emerges from.
      const fade = /mask-image:\s*linear-gradient\(180deg, #000 calc\(100% - var\(--hero-fade\)\), transparent 100%\);/;
      const surfaceRule = heroStyles.match(/^\.hero::before \{([\s\S]*?)^\}/m)?.[1];
      const networkRule = heroStyles.match(/^\.network \{([\s\S]*?)^\}/m)?.[1];

      expect(surfaceRule).toMatch(fade);
      expect(networkRule).toMatch(fade);
    });

    it("leaves no trace of the former CSS backdrop", () => {
      const rules = heroStyles.replace(/\/\*[\s\S]*?\*\//g, "");

      expect(rules).not.toMatch(/\.(backdrop|blooms|gridLines|grain)\b/);
      expect(rules).not.toMatch(/heroBloomDrift/);
    });

    it("never fades secondary blocks in from zero opacity", () => {
      // An `opacity: 0` fill would leave the two CTAs invisible yet clickable
      // while the animation runs.
      const keyframes = heroStyles.match(/^@keyframes riseIn \{([\s\S]*?)^\}/m)?.[1];

      expect(keyframes).toBeDefined();
      expect(keyframes).not.toMatch(/opacity/);
      // The removed keyframes are still named in a comment explaining the fix.
      expect(heroStyles.replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/fadeInUp/);
    });
  });
});
