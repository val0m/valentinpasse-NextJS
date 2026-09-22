/**
 * Only an absolute https URL may reach the markup: a relative one would resolve
 * against the portfolio itself, and an http one would downgrade the connection
 * on a link opened in a new tab.
 */
export function isPublishableLink(url: string | undefined): url is string {
  return typeof url === "string" && /^https:\/\/\S+$/.test(url.trim());
}
