import fs from "fs";
import path from "path";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { HomePage } from "./homePage";
import { getPortfolioContent } from "../../content/portfolioContent";

const repoRoot = path.join(__dirname, "..", "..");
const readFromRoot = (relativePath: string) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

describe("HomePage composition", () => {
  it("renders the hero first and the projects band outside the light container", () => {
    const { container } = render(<HomePage locale="fr" />);

    const main = container.querySelector("#main-content") as HTMLElement;
    expect(main.firstElementChild).toHaveAttribute("id", "hero");

    // identity-obj-proxy maps CSS-module classes to their own name, so the light
    // wrapper is reachable as `#main-content > .container`.
    const lightContainer = main.querySelector(":scope > .container") as HTMLElement;
    expect(lightContainer).not.toBeNull();
    expect(lightContainer.querySelector("#projects")).toBeNull();

    // …and the section is still on the page, as a full-bleed sibling.
    expect(main.querySelector(":scope > #projects")).not.toBeNull();
  });

  it("keeps the hero and projects navigation anchors resolvable", () => {
    const { container } = render(<HomePage locale="fr" />);

    expect(container.querySelector("#hero")).not.toBeNull();
    expect(container.querySelector("#projects")).not.toBeNull();

    const navigation = screen.getByRole("navigation", {
      name: getPortfolioContent("fr").navigation.mainNavAriaLabel,
    });
    expect(within(navigation).getByRole("link", { name: "Projets" })).toHaveAttribute(
      "href",
      "#projects"
    );
  });

  it("keeps the hero and projects copy in parity across locales", () => {
    (["fr", "en"] as const).forEach((locale) => {
      const content = getPortfolioContent(locale);
      const { container, unmount } = render(<HomePage locale={locale} />);

      expect(screen.getByRole("heading", { level: 1, name: content.hero.name })).toBeVisible();

      const projects = container.querySelector("#projects") as HTMLElement;
      expect(within(projects).getByRole("heading", { level: 2 })).toHaveTextContent(
        content.projects.title
      );
      expect(within(projects).getAllByRole("heading", { level: 3 })).toHaveLength(
        content.projects.items.length
      );
      expect(within(projects).getAllByText(content.projects.disclosureLabel)).toHaveLength(
        content.projects.items.length
      );

      unmount();
    });
  });
});

describe("Spline removal regressions", () => {
  it("declares no Spline dependency", () => {
    const packageJson = JSON.parse(readFromRoot("package.json"));
    const declared = Object.keys({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    });

    expect(declared.filter((name) => name.includes("spline"))).toHaveLength(0);
  });

  it("omits 'wasm-unsafe-eval' and the Spline origin from the CSP", () => {
    const nextConfig = readFromRoot("next.config.js");
    const directives = nextConfig.match(/"(script-src|connect-src)[^"]*"/g) ?? [];

    expect(directives).toHaveLength(2);
    directives.forEach((directive) => {
      expect(directive).not.toContain("wasm-unsafe-eval");
      expect(directive).not.toContain("prod.spline.design");
    });
  });

  it("emits no Spline preconnect or dns-prefetch in the head", () => {
    const { container } = render(<HomePage locale="fr" />);

    // next/head is stubbed to a Fragment in jest.setup.ts, so head links render
    // inline and are queryable here. Scoped to the Spline origin on purpose: a
    // legitimate preconnect added later must not fail a Spline regression test.
    const hints = container.querySelectorAll(
      "link[rel='preconnect'][href*='spline'], link[rel='dns-prefetch'][href*='spline']"
    );

    expect(hints).toHaveLength(0);
  });

  it("mounts no canvas anywhere on the page", () => {
    const { container } = render(<HomePage locale="fr" />);

    expect(container.querySelector("canvas")).toBeNull();
  });
});
