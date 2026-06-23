/** @type {import('next').NextConfig} */
// Content-Security-Policy candidate, shipped in *Report-Only* mode first so it
// can never break rendering: the browser evaluates it and POSTs any violation
// to /api/csp-report (also visible in DevTools) without blocking anything.
// Once the report stream is clean, promote the header key from
// `Content-Security-Policy-Report-Only` to `Content-Security-Policy` to enforce.
//
// Notes on the allowances below (this is a statically prerendered site, so a
// per-request script nonce is not practical — hence the pragmatic 'unsafe-inline'):
//   - style-src 'unsafe-inline'  → next/font + next/image inject inline styles
//   - script-src 'unsafe-inline' → Next.js bootstrap + the gtag config script
//   - 'wasm-unsafe-eval'         → the Spline WebGL runtime uses WebAssembly
//   - connect-src prod.spline.design → the 3D scene fetch; *.google-analytics /
//     vercel-insights → GA4 + Vercel Analytics beacons
const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://www.google-analytics.com",
  "connect-src 'self' https://prod.spline.design https://www.google-analytics.com https://*.google-analytics.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
  "report-uri /api/csp-report",
  "report-to csp",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Modern reporting target for the `report-to csp` directive above.
  { key: "Reporting-Endpoints", value: 'csp="/api/csp-report"' },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicyReportOnly },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
