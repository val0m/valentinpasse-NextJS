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
    expect(skipLink).toHaveAttribute("href", "#hero");
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
});
