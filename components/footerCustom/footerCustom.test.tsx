import React from "react";
import { render, screen } from "@testing-library/react";
import { FooterCustom } from "./footerCustom";
import { portfolioSocialLinks } from "../../content/portfolioContent";

describe("FooterCustom", () => {
  it("renders visible, crawlable social links matching the JSON-LD sameAs URLs", () => {
    render(<FooterCustom locale="fr" />);

    for (const social of portfolioSocialLinks) {
      const link = screen.getByRole("link", { name: social.ariaLabel.fr });
      expect(link).toHaveAttribute("href", social.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("localizes the social link aria-labels for the English locale", () => {
    render(<FooterCustom locale="en" />);

    const github = screen.getByRole("link", {
      name: "Valentin PASSE's GitHub profile (opens in a new tab)",
    });
    expect(github).toHaveAttribute("href", "https://github.com/val0m");

    const linkedin = screen.getByRole("link", {
      name: "Valentin PASSE's LinkedIn profile (opens in a new tab)",
    });
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/valentin-passe/",
    );
  });
});
