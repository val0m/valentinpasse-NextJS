import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./heroSection";

describe("HeroSection", () => {
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
});
