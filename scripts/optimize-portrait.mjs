import sharp from "sharp";
import { stat, rename, unlink } from "node:fs/promises";

const SRC = "public/images/resume/valentin-passe.jpg";
const TMP_JPG = "public/images/resume/valentin-passe.tmp.jpg";
const DST_JPG = "public/images/resume/valentin-passe.jpg";
const DST_WEBP = "public/images/resume/valentin-passe.webp";

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
