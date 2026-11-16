// Import the public cover photographs for the neighbourhood guide, keeping sources for review.
// Run from the repository root: node crawl/import-neighbourhood-photography.mjs [--discover]
import fs from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const web = path.join(root, "web");
const require = createRequire(path.join(web, "package.json"));
const sharp = require("sharp");
const cache = path.join(tmpdir(), "pl-neighbourhood-photography");
const sourceRoot = "https://www.bayut.com/area-guides/";
const sourceOverrides = {
  "damac-hills-2": "https://www.propertyfinder.ae/en/area-insights/dubai/damac-hills-2",
  "akoya-oxygen": "https://www.propertyfinder.ae/en/area-insights/dubai/damac-hills-2",
  "dubai-south": "https://www.propertyfinder.ae/en/area-insights/dubai/dubai-south-dubai-world-central",
  "damac-lagoons": "https://www.propertyfinder.ae/en/area-insights/dubai/damac-lagoons",
  "mina-rashid": "https://www.propertyfinder.ae/en/area-insights/dubai/mina-rashid",
  "green-community": "https://www.propertyfinder.ae/en/area-insights/dubai/dubai-investment-park-dip-dubai-investment-park-1-dip-1-green-community",
};
const selectedSources = {
  "downtown-dubai": { src: "https://d3ob0s3rxbjyep.cloudfront.net/content/burj_khalifa_view_342021_ad82273d42.jpg", alt: "Burj Khalifa in Downtown Dubai" },
  "dubai-harbour": {"src":"https://cdn.prod.website-files.com/69944f5c3c447bba91a9aa30/69944f5c3c447bba91a9abe1_Marinas%20Header.avif","alt":"Dubai Harbour marina at sunset"},
  "dubai-creek-harbour": { src: "https://d3ob0s3rxbjyep.cloudfront.net/content/dubai_creek_harbour_1_150425_cc2672e472.jpg", alt: "Dubai Creek Harbour" },
  "damac-lagoons": { src: "https://images.ctfassets.net/zoq5l15g49wj/MdCGy2LrK8Iy3bgGDDYxh/54df45103b8a57d5c82c9295f5ebe355/Santorini_16x9.jpg", alt: "Santorini at DAMAC Lagoons" },
  "mina-rashid": { src: "https://uae-cms.emaar.com/uploads/02_Page_top_banner_2880x900px_37f82542e8.jpg", alt: "Rashid Yachts and Marina waterfront" },
};
sourceOverrides["dubai-harbour"] = "https://www.dubaiharbour.com/marinas";
sourceOverrides["damac-lagoons"] = "https://www.damacgroup.com/en-ae/d-hub/press-releases/damac-lagoons-begins-handover-welcomes-first-residents-homeowners-santorini-cluster/";
sourceOverrides["mina-rashid"] = "https://www.emaar.com/en/our-communities/rashid-yachts-marina";
const localSources = { "palm-jumeirah": "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg", "maritime-city": "/images/dubai-maritime.webp" };
const preferredAlts = {
  meydan: "streets in meydan",
  "al-sufouh": "souk madinat",
  "arabian-ranches": "villas in arabian ranches",
  "arabian-ranches-2": "arabian ranches 2 houses",
  "umm-suqeim": "kite beach",
};
const aliases = {
  "jumeirah-beach-residence": "jumeirah-beach-residence-jbr",
  "jumeirah-lake-towers": "jumeirah-lake-towers",
  "jumeirah-village-circle": "jumeirah-village-circle",
  meydan: "meydan-city",
  "emaar-beachfront-2": "emaar-beachfront",
  "maritime-city": "dubai-maritime-city",
  "dubai-land": "dubailand",
  "damac-hills-akoya-by-damac": "damac-hills-akoya-damac",
  "akoya-oxygen": "damac-hills-2",
  "the-greens": "the-greens",
  "barsha-heights-tecom": "barsha-heights",
  "dubai-production-city-impz": "dubai-production-city",
  "nadd-al-sheba": "nad-al-sheba",
};
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
const attr = (tag, name) => decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1] ?? "");

async function getText(url, cacheName) {
  const target = path.join(cache, cacheName);
  try { return await fs.readFile(target, "utf8"); } catch {}
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (![429, 502, 503, 504].includes(response.status) || attempt === 2) break;
    await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
  }
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const text = await response.text();
  await fs.writeFile(target, text);
  return text;
}

await fs.mkdir(cache, { recursive: true });
const page = await fs.readFile(path.join(web, "src/app/(site)/dubai-neighbourhoods/page.tsx"), "utf8");
const areas = [...page.matchAll(/\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map((m) => ({ slug: m[1], name: m[2] }));
if (areas.length !== 44) throw new Error(`Expected 44 neighbourhoods, found ${areas.length}`);
const index = await getText(`${sourceRoot}sitemap_index.xml`, "sitemap-index.xml");
const maps = [...index.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).filter((url) => /post-sitemap\d*\.xml$/.test(url));
const pages = new Set();
for (const url of maps) {
  const xml = await getText(url, path.basename(url));
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) pages.add(match[1].replace(/\/$/, ""));
}
const sources = areas.map((area) => {
  const url = `${sourceRoot}${aliases[area.slug] ?? area.slug}`;
  return { ...area, page: sourceOverrides[area.slug] ?? (pages.has(url) ? `${url}/` : null) };
});
const missing = sources.filter((area) => !area.page);
if (missing.length) {
  for (const area of missing) console.log(JSON.stringify({ missing: area.slug, candidates: [...pages].filter((url) => area.slug.split("-").filter((word) => word.length > 3).some((word) => url.split("/").at(-1).includes(word))).slice(0, 12) }));
  throw new Error(`${missing.length} source pages need an explicit match`);
}
if (process.argv.includes("--discover")) {
  for (const source of sources) console.log(JSON.stringify(source));
  process.exit(0);
}

const imageDir = path.join(web, "public/images/neighbourhoods");
await fs.mkdir(imageDir, { recursive: true });
const provenance = [];
const failures = [];
for (let start = 0; start < sources.length; start += 2) {
  const batch = await Promise.allSettled(sources.slice(start, start + 2).map(async (area) => {
    const recordPath = path.join(cache, `${area.slug}.image.json`);
    try {
      const record = JSON.parse(await fs.readFile(recordPath, "utf8"));
      const expected = selectedSources[area.slug]?.src ?? localSources[area.slug];
      if (expected && record.sourceImage !== expected) throw new Error("Photo selection changed");
      await fs.access(path.join(web, "public", record.image));
      console.log(`${area.slug}: using verified local import`);
      return record;
    } catch {}
    const html = localSources[area.slug] || selectedSources[area.slug] ? "" : await getText(area.page, `${area.slug}-${sourceOverrides[area.slug] ? "alternative" : "guide"}.html`);
    const photographs = selectedSources[area.slug] ? [selectedSources[area.slug]] : localSources[area.slug] ? [{ src: localSources[area.slug], alt: area.name }] : (html.match(/<img\b[^>]*>/gi) ?? []).map((tag) => ({ src: attr(tag, "src"), alt: attr(tag, "alt") })).filter(({ src, alt }) => /(?:d3ob0s3rxbjyep.cloudfront.net\/content\/|graph-images.propertyfinder.ae\/ae\/community\/)/.test(src) && /\.(?:jpg|jpeg|png|webp)(?:\?|$)/i.test(src) && !/\bmap\b|overview by|consultant|Jordan Roe|Talia Besser/i.test(alt));
    const preference = preferredAlts[area.slug];
    if (preference) photographs.sort((a, b) => Number(b.alt.toLowerCase().includes(preference)) - Number(a.alt.toLowerCase().includes(preference)));
    let chosen, original, meta;
    for (const photograph of photographs) {
      if (photograph.src.startsWith("/")) original = await fs.readFile(path.join(web, "public", photograph.src));
      else {
        const response = await fetch(photograph.src, { signal: AbortSignal.timeout(30_000) });
        if (!response.ok) continue;
        original = Buffer.from(await response.arrayBuffer());
      }
      meta = await sharp(original).metadata();
      if (meta.width >= 1000 && meta.height >= 600) { chosen = photograph; break; }
    }
    if (!chosen) throw new Error(`No sufficiently large photograph for ${area.slug}`);
    const output = await sharp(original).rotate().resize({ width: 1800, height: 1400, fit: "inside", withoutEnlargement: true }).webp({ quality: 90, effort: 5 }).toBuffer({ resolveWithObject: true });
    const filenames = { "downtown-dubai": "downtown-dubai-landmark", "palm-jumeirah": "palm-jumeirah-aerial" };
    const image = `/images/neighbourhoods/${filenames[area.slug] ?? area.slug}.webp`;
    await fs.writeFile(path.join(web, "public", image), output.data);
    console.log(`${area.slug}: ${meta.width}x${meta.height} → ${output.info.width}x${output.info.height}, ${Math.round(output.info.size / 1024)} KB`);
    const record = { slug: area.slug, name: area.name, sourcePage: area.page, sourceImage: chosen.src, sourceAlt: chosen.alt, image, width: output.info.width, height: output.info.height, bytes: output.info.size, alternatives: photographs.slice(1, 6) };
    await fs.writeFile(recordPath, JSON.stringify(record));
    return record;
  }));
  for (const result of batch) {
    if (result.status === "fulfilled") provenance.push(result.value);
    else { failures.push(String(result.reason)); console.log(String(result.reason)); }
  }
  await new Promise((resolve) => setTimeout(resolve, 250));
}
if (failures.length) throw new Error(`Resolve ${failures.length} missing photographs: ${failures.join("; ")}`);
await fs.writeFile(path.join(web, "content/neighbourhood-images.json"), JSON.stringify(Object.fromEntries(provenance.map((image) => [image.slug, image.image])), null, 2) + "\n");
await fs.writeFile(path.join(root, "crawl/neighbourhood-photography-sources.json"), JSON.stringify(provenance, null, 2) + "\n");
