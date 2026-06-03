import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./heroSection";

describe("HeroSection", () => {
  it("renders English aria-labels and floating panel text when locale is 'en'", () => {
    render(<HeroSection locale="en" />);

    expect(screen.getByLabelText("Key proof points")).toBeInTheDocument();
    expect(screen.getByLabelText("Main actions")).toBeInTheDocument();
    expect(screen.getByText("Delivery focus")).toBeInTheDocument();
    expect(screen.getByText("Architecture .NET, Blazor, useful AI")).toBeInTheDocument();
  });

  it("renders French aria-labels and floating panel text when locale is 'fr'", () => {
    render(<HeroSection locale="fr" />);

    expect(screen.getByLabelText("Points clés")).toBeInTheDocument();
    expect(screen.getByLabelText("Actions principales")).toBeInTheDocument();
    expect(screen.getByText("Focus livraison")).toBeInTheDocument();
    expect(screen.getByText("Architecture .NET, Blazor, IA utile")).toBeInTheDocument();
  });
});
