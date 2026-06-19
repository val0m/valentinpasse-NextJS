import { getPortfolioContent, portfolioEmail, portfolioContent } from "./portfolioContent";

describe("getPortfolioContent", () => {
  it("returns French content for the 'fr' locale", () => {
    const content = getPortfolioContent("fr");

    expect(content.localeName).toBe("FR");
    expect(content.switchLocaleLabel).toBe("EN");
    expect(content.meta.title).toMatch(/Freelance Fullstack \.NET/);
  });

  it("returns English content for the 'en' locale", () => {
    const content = getPortfolioContent("en");

    expect(content.localeName).toBe("EN");
    expect(content.switchLocaleLabel).toBe("FR");
    expect(content.meta.title).toMatch(/Fullstack \.NET/);
  });

  it("falls back to French content for an unsupported locale", () => {
    // @ts-expect-error intentionally passing an unsupported locale to validate fallback behavior
    const content = getPortfolioContent("de");

    expect(content).toBe(portfolioContent.fr);
  });

  it("exposes the navigation items in the same order for both locales", () => {
    const fr = getPortfolioContent("fr").navigation.items.map((item) => item.id);
    const en = getPortfolioContent("en").navigation.items.map((item) => item.id);

    expect(fr).toEqual(en);
    expect(fr).toContain("hero");
    expect(fr).toContain("contact");
  });

  it("exposes a portfolio email constant", () => {
    expect(portfolioEmail).toMatch(/@/);
  });

  describe("localized accessibility and visible labels", () => {
    const locales = ["fr", "en"] as const;

    type LabelPath = readonly [string, string];

    const requiredLabels: LabelPath[] = [
      ["navigation", "mainNavAriaLabel"],
      ["hero", "proofPointsAriaLabel"],
      ["hero", "actionsAriaLabel"],
      ["hero", "floatingLabel"],
      ["hero", "floatingValue"],
      ["about", "principlesAriaLabel"],
      ["services", "clientProblemLabel"],
      ["services", "businessOutcomeLabel"],
      ["services", "ctaLabel"],
      ["experience", "contextLabel"],
      ["experience", "valueDeliveredLabel"],
      ["experience", "techListAriaLabel"],
      ["projects", "contextLabel"],
      ["projects", "contributionLabel"],
      ["projects", "outcomeLabel"],
      ["projects", "tagsAriaLabel"],
      ["projects", "externalLinkAriaTemplate"],
      ["projects", "externalLinkLabel"],
      ["contact", "inquiriesAriaLabel"],
      ["contact", "sendEmailAriaLabel"],
      ["contact", "copyEmailAriaLabel"],
    ];

    locales.forEach((locale) => {
      requiredLabels.forEach(([section, field]) => {
        it(`exposes a non-empty ${section}.${field} for locale '${locale}'`, () => {
          const content = getPortfolioContent(locale) as unknown as Record<string, Record<string, string>>;
          const value = content[section]?.[field];
          expect(typeof value).toBe("string");
          expect(value.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it("project external link template contains the {title} placeholder", () => {
      locales.forEach((locale) => {
        expect(getPortfolioContent(locale).projects.externalLinkAriaTemplate).toContain("{title}");
      });
    });
  });
});
