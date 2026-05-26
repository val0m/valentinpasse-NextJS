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
});
