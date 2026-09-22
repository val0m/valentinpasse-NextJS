import React from "react";
import { render, screen } from "@testing-library/react";
import { Layout } from "./layout";

describe("Layout", () => {
  it("renders a skip link to the hero section in French", () => {
    render(
      <Layout locale="fr">
        <p>contenu</p>
      </Layout>
    );

    const skipLink = screen.getByRole("link", { name: "Aller au contenu" });
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("renders a skip link in English when the locale is 'en'", () => {
    render(
      <Layout locale="en">
        <p>content</p>
      </Layout>
    );

    expect(screen.getByRole("link", { name: "Skip to content" })).toBeInTheDocument();
  });

  it("renders the page children", () => {
    render(
      <Layout locale="fr">
        <p>child-content</p>
      </Layout>
    );

    expect(screen.getByText("child-content")).toBeInTheDocument();
  });

  it("credits each web work to the Person in the JSON-LD graph", () => {
    const { container } = render(
      <Layout locale="fr">
        <p>contenu</p>
      </Layout>
    );

    const script = container.querySelector('script[type="application/ld+json"]') as HTMLElement;
    const graph = JSON.parse(script.innerHTML)["@graph"] as Array<Record<string, unknown>>;
    const person = graph.find((node) => node["@type"] === "Person") as Record<string, unknown>;
    const webWork = graph.filter(
      (node) => node["@type"] === "WebSite" && node.creator !== undefined
    );

    expect(webWork.map((node) => node.url)).toEqual([
      "https://www.cabinet-passe.fr/",
      "https://www.wanderun.fr/",
    ]);
    webWork.forEach((node) => {
      expect(node.dateCreated).toBe("2026");
      expect(node.creator).toEqual({ "@id": person["@id"] });
    });
  });
});
