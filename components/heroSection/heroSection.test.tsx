import fs from "fs";
import path from "path";
import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./heroSection";
import { getPortfolioContent } from "../../content/portfolioContent";

const heroStyles = fs.readFileSync(path.join(__dirname, "heroSection.module.scss"), "utf8");

function mockMatchMedia(matcher: (query: string) => boolean) {
  // jest.setup.ts installs matchMedia as writable but not configurable, so it is
  // reassigned rather than redefined.
  window.matchMedia = ((query: string) => ({
    matches: matcher(query),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("HeroSection", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockMatchMedia(() => false);
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

  it("mounts no canvas and no WebGL surface", () => {
    const { container } = render(<HeroSection locale="fr" />);

    expect(container.querySelector("canvas")).toBeNull();
    expect(container.querySelector("[class*='spline']")).toBeNull();
  });

  it("binds no scroll listener under prefers-reduced-motion", () => {
    mockMatchMedia((query) => query === "(prefers-reduced-motion: reduce)");
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

    it("suppresses the backdrop drift under prefers-reduced-motion", () => {
      expect(heroStyles).toMatch(
        /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.blooms::before,\s*\n\s*\.blooms::after \{\s*\n\s*animation: none;/
      );
    });
  });
});
