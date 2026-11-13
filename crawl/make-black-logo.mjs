// The only black logo in the media library is 234x44, which the header now displays at up to
// 186px — soft on a high-density screen. The white logo is the same artwork at 438x82, and both
// are pure monochrome with an alpha channel (verified: every opaque pixel is 255,255,255 in the
// white file and 0,0,0 in the black one). So the black mark can simply be re-coloured from the
// larger white one, which nearly doubles its resolution without inventing any detail.
//
// Run from the repo root: node crawl/make-black-logo.mjs
// sharp is a dependency of Next, so it lives in web/node_modules — resolve it from there
// rather than from this folder, which has no node_modules of its own.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const sharp = createRequire(new URL('../web/package.json', import.meta.url)).call(null, 'sharp');

// sharp takes paths, not URLs
const src = fileURLToPath(new URL('../web/public/wp-content/uploads/2022/11/logo-prestige-luxury-white-2x.png', import.meta.url));
const out = fileURLToPath(new URL('../web/public/wp-content/uploads/2022/11/logo-prestige-luxury-black-2x.png', import.meta.url));

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

let opaque = 0;
let impure = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] >= 200) {
    opaque++;
    if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) impure++;
  }
  // keep the alpha, drop the colour to black
  data[i] = 0;
  data[i + 1] = 0;
  data[i + 2] = 0;
}
if (impure) throw new Error(`source is not pure white (${impure} of ${opaque} opaque pixels differ) — re-colouring would change the mark`);

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(out);

const written = await sharp(out).metadata();
console.log(`wrote ${out.split(/[\/]/).pop()} — ${written.width}x${written.height} (was 234x44), from ${opaque} opaque pixels`);
