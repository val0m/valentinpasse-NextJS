import React from "react";
import { render, screen } from "@testing-library/react";
import { HeaderCustom } from "./headerCustom";
import { getPortfolioContent } from "../../content/portfolioContent";

describe("HeaderCustom", () => {
  it("renders all primary navigation items in French", () => {
    render(<HeaderCustom locale="fr" />);

    const navItems = getPortfolioContent("fr").navigation.items;
    navItems.forEach((item) => {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    });
  });

  it("renders the locale switcher link pointing to the other locale root", () => {
    render(<HeaderCustom locale="fr" />);

    const localeSwitcher = screen.getByLabelText(
      getPortfolioContent("fr").navigation.localeSwitcherLabel
    );
    expect(localeSwitcher).toHaveAttribute("href", expect.stringMatching(/^\/en/));
  });

  it("renders the locale switcher pointing back to '/' when on the English page", () => {
    render(<HeaderCustom locale="en" />);

    const localeSwitcher = screen.getByLabelText(
      getPortfolioContent("en").navigation.localeSwitcherLabel
    );
    expect(localeSwitcher).toHaveAttribute("href", expect.stringMatching(/^\/#/));
  });
});
