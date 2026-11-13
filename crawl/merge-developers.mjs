// Folds the researched developer facts (data/devs-1..4.json) into web/content/developers.json.
// The seed file owns the list, the slugs, the display names and the registration status;
// research only fills the descriptive fields, and only where it actually found something.
import { readFileSync, writeFileSync } from 'node:fs';

const out = new URL('../web/content/developers.json', import.meta.url);
const seed = JSON.parse(readFileSync(out, 'utf8'));

const researched = new Map();
for (const n of [1, 2, 3, 4]) {
  const file = new URL(`./data/devs-${n}.json`, import.meta.url);
  let rows;
  try {
    rows = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.warn(`! devs-${n}.json missing or invalid (${e.code || e.message}) — skipped`);
    continue;
  }
  for (const r of rows) {
    if (!r?.slug) continue;
    if (researched.has(r.slug)) console.warn(`! duplicate research for ${r.slug}`);
    researched.set(r.slug, r);
  }
}

const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim()) : []);
const year = (v) => (Number.isInteger(v) && v > 1800 && v <= new Date().getFullYear() ? v : null);
const url = (v) => {
  const s = str(v);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString().replace(/\/$/, '') : null;
  } catch {
    return null;
  }
};
const projects = (v) =>
  (Array.isArray(v) ? v : [])
    .map((p) => ({ name: str(p?.name), community: str(p?.community) }))
    .filter((p) => p.name)
    .slice(0, 8);

const merged = seed.map((d) => {
  const r = researched.get(d.slug);
  if (!r) return d;
  return {
    ...d,
    tagline: str(r.tagline),
    founded: year(r.founded),
    headquarters: str(r.headquarters),
    founder: str(r.founder),
    website: url(r.website),
    description: list(r.description),
    specialities: list(r.specialities).slice(0, 5),
    projects: projects(r.projects),
    communities: list(r.communities).slice(0, 8),
  };
});

writeFileSync(out, JSON.stringify(merged, null, 1) + '\n');

const missing = merged.filter((d) => !d.description.length).map((d) => d.slug);
const thin = merged.filter((d) => d.description.length === 1).map((d) => d.slug);
console.log(`${merged.length} developers; ${merged.length - missing.length} with a description`);
if (thin.length) console.log(`only one paragraph (${thin.length}): ${thin.join(', ')}`);
if (missing.length) console.log(`NO description (${missing.length}): ${missing.join(', ')}`);
const counts = (k) => merged.filter((d) => (Array.isArray(d[k]) ? d[k].length : d[k] != null)).length;
console.log({ founded: counts('founded'), headquarters: counts('headquarters'), founder: counts('founder'), website: counts('website'), projects: counts('projects'), communities: counts('communities') });
