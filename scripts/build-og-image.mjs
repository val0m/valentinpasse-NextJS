// Generates a dedicated 1200x630 OG image used by Open Graph / Twitter previews.
//
// Output:
//   public/og-image.webp  (served as og:image / twitter:image)
//   public/og-image.jpg   (fallback for clients without WebP support)
//
// Source: public/images/resume/valentin-passe.jpg (canonical portrait).
// Re-run with `npm run build:og` after updating the portrait or branding.

import sharp from "sharp";
import { stat } from "node:fs/promises";

const PORTRAIT_SRC = "public/images/resume/valentin-passe.jpg";
const OG_WEBP = "public/og-image.webp";
const OG_JPG = "public/og-image.jpg";

const WIDTH = 1200;
const HEIGHT = 630;
const PORTRAIT_WIDTH = 500;

await stat(PORTRAIT_SRC).catch(() => {
  throw new Error(`Source portrait missing or unreadable: ${PORTRAIT_SRC}`);
});

const portraitBuffer = await sharp(PORTRAIT_SRC)
  .rotate()
  .resize({ width: PORTRAIT_WIDTH, height: HEIGHT, fit: "cover", position: "top" })
  .toBuffer();

const fadeOverlay = Buffer.from(
  `<svg width="${PORTRAIT_WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="60%" stop-color="#18181b" stop-opacity="0" />
        <stop offset="100%" stop-color="#18181b" stop-opacity="1" />
      </linearGradient>
    </defs>
    <rect width="${PORTRAIT_WIDTH}" height="${HEIGHT}" fill="url(#fade)" />
  </svg>`,
);

const textSvg = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <text x="560" y="270" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="#ffffff">Valentin PASSE</text>
    <text x="560" y="332" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="500" fill="#93c5fd">Freelance Fullstack .NET</text>
    <text x="560" y="402" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#cbd5e1">Architecture .NET · Blazor · IA utile</text>
    <text x="560" y="582" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#94a3b8">valentinpasse.fr</text>
  </svg>`,
);

const pipeline = sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: { r: 9, g: 17, b: 27, alpha: 1 },
  },
}).composite([
  { input: portraitBuffer, top: 0, left: 0 },
  { input: fadeOverlay, top: 0, left: 0 },
  { input: textSvg, top: 0, left: 0 },
]);

await pipeline.clone().webp({ quality: 85 }).toFile(OG_WEBP);
await pipeline.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(OG_JPG);

const webpStat = await stat(OG_WEBP);
const jpgStat = await stat(OG_JPG);
console.log(`WebP: ${OG_WEBP}, ${webpStat.size} bytes (${WIDTH}x${HEIGHT})`);
console.log(`JPG:  ${OG_JPG}, ${jpgStat.size} bytes (${WIDTH}x${HEIGHT})`);
