// Generates the Apple touch icon from the SVG favicon.
//
// Output:
//   public/apple-touch-icon.png  (180x180, declared as rel="apple-touch-icon")
//
// Source: public/icon.svg (the favicon, single source for raster icons).
// Re-run with `npm run build:icons` after updating the favicon.

import sharp from "sharp";
import { stat } from "node:fs/promises";

const ICON_SRC = "public/icon.svg";
const APPLE_TOUCH_ICON = "public/apple-touch-icon.png";

const SIZE = 180;
const SVG_VIEWBOX = 64;
// iOS fills transparent pixels with black: flatten the rounded corners onto the
// tile colour so the home-screen mask shows no dark rim.
const TILE_COLOR = "#18181b";

await stat(ICON_SRC).catch(() => {
  throw new Error(`Source icon missing or unreadable: ${ICON_SRC}`);
});

// Rasterise at the target size directly (72 dpi × scale) rather than upscaling
// a 64px bitmap, so the strokes stay sharp.
await sharp(ICON_SRC, { density: (72 * SIZE) / SVG_VIEWBOX })
  .resize(SIZE, SIZE)
  .flatten({ background: TILE_COLOR })
  .png({ compressionLevel: 9 })
  .toFile(APPLE_TOUCH_ICON);

const pngStat = await stat(APPLE_TOUCH_ICON);
console.log(`PNG: ${APPLE_TOUCH_ICON}, ${pngStat.size} bytes (${SIZE}x${SIZE})`);
