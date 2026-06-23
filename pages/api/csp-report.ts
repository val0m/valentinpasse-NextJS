import type { NextApiRequest, NextApiResponse } from "next";

// Collects Content-Security-Policy violation reports while the policy runs in
// Report-Only mode (see next.config.js). Browsers POST reports as
// `application/csp-report` (legacy report-uri) or `application/reports+json`
// (report-to), neither of which the default Next body parser understands — so
// we disable it and read the raw stream, logging it where it surfaces in the
// host's function logs. Once this stream is clean, the CSP can be enforced.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }

  try {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      // Hard cap so a malformed/oversized body can never exhaust memory.
      if (raw.length > 16_384) {
        break;
      }
    }
    if (raw) {
      console.warn("[csp-report]", raw.slice(0, 16_384));
    }
  } catch {
    // Reporting is best-effort; never surface an error to the browser.
  }

  res.status(204).end();
}
