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

/** Body of the file's single top-level reduced-motion block. */
const reducedMotionBlock = heroStyles.match(
  /^@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)^\}/m
)?.[1];

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

  it("mounts no canvas and no WebGL surface", () => {
    const { container } = render(<HeroSection locale="fr" />);

    expect(container.querySelector("canvas")).toBeNull();
    expect(container.querySelector("[class*='spline']")).toBeNull();
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

    it("suppresses the backdrop drift inside the reduced-motion block itself", () => {
      // Asserted against the extracted block, not the whole file: the file holds
      // several nested reduced-motion blocks, and a loose match would stay green
      // even if this rule drifted out of its media query.
      expect(reducedMotionBlock).toBeDefined();
      expect(reducedMotionBlock).toMatch(
        /\.blooms::before,\s*\.blooms::after \{\s*animation: none;\s*\}/
      );
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
