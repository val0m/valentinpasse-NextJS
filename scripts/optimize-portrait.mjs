// Re-encodes the canonical portrait into a clean JPG and an optimized WebP.
//
// The .jpg at public/images/resume/valentin-passe.jpg is the canonical
// high-resolution source — even though only the .webp is imported by
// next/image, the .jpg must remain in the repo so this script (and any future
// asset pipeline) can regenerate the WebP from a known-good source. Do not
// delete the .jpg even if it appears unused via static analysis.
//
// Run with `npm run optimize:portrait` after replacing the .jpg with a new
// portrait.

import sharp from "sharp";
import { stat, rename, unlink } from "node:fs/promises";

const SRC = "public/images/resume/valentin-passe.jpg";
const TMP_JPG = "public/images/resume/valentin-passe.tmp.jpg";
const DST_JPG = "public/images/resume/valentin-passe.jpg";
const DST_WEBP = "public/images/resume/valentin-passe.webp";

await stat(SRC).catch(() => {
  throw new Error(`Source portrait missing or unreadable: ${SRC}`);
});

const meta = await sharp(SRC).metadata();
console.log(`Source: ${meta.width}x${meta.height}, ${meta.format}, ${(await stat(SRC)).size} bytes`);

const pipeline = sharp(SRC).rotate().resize({
  width: 1000,
  height: 1200,
  fit: "inside",
  withoutEnlargement: true,
});

await pipeline.clone().webp({ quality: 82 }).toFile(DST_WEBP);
await pipeline.clone().jpeg({ quality: 86, mozjpeg: true }).toFile(TMP_JPG);

await unlink(DST_JPG);
await rename(TMP_JPG, DST_JPG);

const webpStat = await stat(DST_WEBP);
const jpgStat = await stat(DST_JPG);
console.log(`WebP:    ${DST_WEBP}, ${webpStat.size} bytes`);
console.log(`JPG:     ${DST_JPG}, ${jpgStat.size} bytes`);
