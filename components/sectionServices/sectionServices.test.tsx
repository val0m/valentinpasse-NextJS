import React from "react";
import { render, screen } from "@testing-library/react";
import { SectionServices } from "./sectionServices";
import { getPortfolioContent } from "../../content/portfolioContent";

describe("SectionServices", () => {
  it("renders English block labels, CTA and aria-label when locale is 'en'", () => {
    render(<SectionServices locale="en" />);

    expect(screen.getAllByText("Client problem").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Business outcome").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Discuss this service").length).toBeGreaterThan(0);

    // The CTA's accessible name is composed from the localized visible label
    // plus the service title, so it contains the visible text (WCAG 2.5.3).
    const firstService = getPortfolioContent("en").services.items[0];
    expect(
      screen.getByRole("link", { name: `Discuss this service — ${firstService.title}` }),
    ).toBeInTheDocument();

    // No residual French should leak on the EN page (issue #33).
    expect(screen.queryByText("Problème adressé")).not.toBeInTheDocument();
    expect(screen.queryByText("Bénéfice métier")).not.toBeInTheDocument();
    expect(screen.queryByText("Discuter de ce service")).not.toBeInTheDocument();
  });

  it("renders French block labels, CTA and aria-label when locale is 'fr'", () => {
    render(<SectionServices locale="fr" />);

    expect(screen.getAllByText("Problème adressé").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bénéfice métier").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Discuter de ce service").length).toBeGreaterThan(0);

    const firstService = getPortfolioContent("fr").services.items[0];
    expect(
      screen.getByRole("link", { name: `Discuter de ce service — ${firstService.title}` }),
    ).toBeInTheDocument();
  });
});
