import { isPublishableLink } from "./isPublishableLink";

describe("isPublishableLink", () => {
  it.each(["https://example.com", "https://www.cabinet-passe.fr/", "  https://example.com  "])(
    "accepts the absolute https URL %p",
    (url) => {
      expect(isPublishableLink(url)).toBe(true);
    }
  );

  it.each([
    undefined,
    "",
    "http://example.com",
    "/somewhere",
    "example.com",
    "javascript:alert(1)",
    "https://exa mple.com",
  ])("rejects %p", (url) => {
    expect(isPublishableLink(url)).toBe(false);
  });
});
