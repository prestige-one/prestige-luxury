// Merges the Bayut-only listings (data/bayut-listings.json + data/bayut-cards.json for addresses)
// into web/content/properties.json, which already holds the Property Finder set.
// Listings present on both portals are matched on the agency reference and kept as Property Finder's.
import { readFileSync, writeFileSync } from 'node:fs';

const here = (f) => new URL(`./data/${f}`, import.meta.url);
const detail = JSON.parse(readFileSync(here('bayut-listings.json'), 'utf8')).listings;
const cards = JSON.parse(readFileSync(here('bayut-cards.json'), 'utf8')).cards;
const out = new URL('../web/content/properties.json', import.meta.url);
const existing = JSON.parse(readFileSync(out, 'utf8'));

const cardByUrl = new Map(cards.map((c) => [c.url, c]));
const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');

// Bayut prints an address as "<Building> <Community> <City>" with no separators. Split it by
// looking for a known community name; the Property Finder set supplies most of them.
const knownCommunities = [
  ...new Set(existing.map((p) => p.community)),
  'Dubai Sports City', 'Dubai Silicon Oasis (DSO)', 'Arabian Ranches 2', 'Arabian Ranches',
  'Jumeirah Village Circle (JVC)', 'Jumeirah Beach Residence (JBR)', 'Palm Jumeirah', 'Dubai Marina',
  'Downtown Dubai', 'Business Bay', 'DIFC', 'Al Furjan', 'Remraam', 'Dubai Islands', 'Dubai Hills Estate',
  'Jumeirah Lake Towers (JLT)', 'Dubai Creek Harbour', 'Town Square', 'Mudon',
  'DAMAC Hills 2 (Akoya by DAMAC)', 'DAMAC Hills', 'Dubai Production City (IMPZ)',
  'Dubai Land Residence Complex (DLRC)',
].sort((a, b) => b.length - a.length); // longest first, so "Arabian Ranches 2" wins over "Arabian Ranches"

/** "Hub Canal 2 Dubai Sports City Dubai" → { building, community, city } */
function splitAddress(address = '') {
  const a = address.trim();
  for (const c of knownCommunities) {
    const i = a.toLowerCase().indexOf(c.toLowerCase());
    if (i < 0) continue;
    const building = a.slice(0, i).trim();
    const city = a.slice(i + c.length).trim() || 'Dubai';
    return { building, community: c.replace(/\s*\([^)]*\)$/, ''), city };
  }
  const parts = a.split(/\s+/);
  return { building: parts.slice(0, -2).join(' '), community: parts.slice(-2, -1).join(' ') || 'Dubai', city: parts.at(-1) || 'Dubai' };
}

const num = (v) => {
  if (v == null || v === '') return null;
  if (String(v).toLowerCase() === 'studio') return 0;
  const n = parseInt(String(v).replace(/,/g, ''), 10);
  return Number.isFinite(n) ? n : null;
};
const cleanText = (s = '') => s.replace(/⁠/g, '').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
const typeName = (t = '') => {
  const x = t.trim();
  if (/^office/i.test(x)) return 'Office';
  if (/^(shop|retail)/i.test(x)) return 'Shop';
  if (/^(house|villa)/i.test(x)) return 'Villa';
  return x || 'Apartment';
};

const haveRefs = new Set(existing.map((p) => p.reference));
const added = [];

for (const r of detail) {
  if (!r.reference || haveRefs.has(r.reference)) continue;
  const card = cardByUrl.get(r.url) ?? {};
  const { building, community, city } = splitAddress(card.address || r.location || '');
  const beds = num(r.beds);
  const purpose = /rent/i.test(r.purpose || '') ? 'rent' : 'sale';
  const rawType = typeName(r.type);
  const type = beds === 0 && rawType === 'Apartment' ? 'Studio' : rawType;
  const id = (r.url.match(/details-(\d+)/) || [])[1];
  const location = [building, community, city].filter(Boolean);
  const slugBase = [type, beds ? `${beds} bed` : '', purpose === 'sale' ? 'for sale' : 'for rent', building || community].filter(Boolean).join(' ');

  added.push({
    id: `bayut-${id}`,
    slug: `${slugify(slugBase)}-${id}`,
    reference: r.reference,
    source: 'bayut',
    sourceUrl: r.url,
    title: cleanText(r.title),
    description: cleanText(r.description),
    purpose,
    completion: /off[\s-]?plan/i.test(r.completion || '') ? 'off-plan' : 'ready',
    type,
    price: num(r.price),
    ...(purpose === 'rent' ? { rentFrequency: 'yearly' } : {}),
    bedrooms: beds,
    bathrooms: num(r.baths),
    sizeSqft: num(r.area),
    location,
    community,
    city: city || 'Dubai',
    images: (r.images || []).map((u) => u.split('?')[0]),
    amenities: (r.amenities || []).filter((a) => !/^\+/.test(a)),
    furnished: /^furnished/i.test(r.furnishing || '') ? true : /^unfurnished/i.test(r.furnishing || '') ? false : null,
    agent: r.agent ? { name: r.agent } : undefined,
    listedAt: r.addedOn ? new Date(r.addedOn).toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  });
  haveRefs.add(r.reference);
}

const merged = [...existing, ...added].sort((a, b) => (b.listedAt || '').localeCompare(a.listedAt || ''));
if (new Set(merged.map((m) => m.slug)).size !== merged.length) throw new Error('Duplicate slugs after merge');
writeFileSync(out, JSON.stringify(merged, null, 1) + '\n');

const by = (k) => merged.reduce((m, l) => ((m[l[k]] = (m[l[k]] || 0) + 1), m), {});
console.log(`added ${added.length} from Bayut; total ${merged.length}`);
console.log(by('source'), by('purpose'), by('type'));
console.log('added:', added.map((a) => `${a.type} ${a.bedrooms ?? '-'}bd ${a.community}`).join(' | '));
