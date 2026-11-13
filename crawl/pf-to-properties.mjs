// Converts the Property Finder snapshot (data/pf-listings.json, collected in the browser)
// into the website's listings file: ../web/content/properties.json
// Usage: node pf-to-properties.mjs [path-to-snapshot.json]
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2] || new URL('./data/pf-listings.json', import.meta.url);
const snap = JSON.parse(readFileSync(src, 'utf8'));
const out = new URL('../web/content/properties.json', import.meta.url);

const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
const num = (v) => {
  if (v == null || v === '') return null;
  if (String(v).toLowerCase() === 'studio') return 0;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
};
const typeName = (t) => (t === 'Office Space' ? 'Office' : t);
const cleanText = (s = '') => s.replace(/⁠/g, '').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

const listings = snap.listings
  .filter((r) => !r.error && r.price && r.title)
  .map((r) => {
    const tree = r.tree?.length ? r.tree : (r.loc?.full || '').split(',').map((s) => s.trim()).reverse();
    const city = tree[0] || 'Dubai';
    const community = tree[1] || r.loc?.name || city;
    const location = [...tree].reverse(); // most specific first
    const beds = num(r.beds);
    // Property Finder lists studios as "Apartment" with 0 bedrooms; the website has its own
    // Studio category, so give those listings that type.
    const type = beds === 0 && typeName(r.type) === "Apartment" ? "Studio" : typeName(r.type);
    const purpose = r.price.period === 'sell' ? 'sale' : 'rent';
    const slugBase = [type, beds ? `${beds} bed` : '', purpose === 'sale' ? 'for sale' : 'for rent', tree[tree.length - 1] || community].filter(Boolean).join(' ');
    return {
      id: `pf-${r.id}`,
      slug: `${slugify(slugBase)}-${r.id}`.toLowerCase(),
      reference: r.regs?.reference || r.reference,
      source: 'propertyfinder',
      sourceUrl: r.url,
      title: cleanText(r.title),
      description: cleanText(r.description),
      purpose,
      completion: r.completion === 'off_plan' ? 'off-plan' : 'ready',
      type,
      price: r.price.value,
      ...(purpose === 'rent' ? { rentFrequency: ['yearly', 'monthly', 'weekly', 'daily'].includes(r.price.period) ? r.price.period : 'yearly' } : {}),
      bedrooms: beds,
      bathrooms: num(r.baths),
      sizeSqft: r.size?.value ?? null,
      location,
      community,
      city,
      ...(r.loc?.coords ? { coordinates: { lat: r.loc.coords.lat, lng: r.loc.coords.lon } } : {}),
      images: (r.images || []).map((u) => u.split('?')[0]),
      amenities: r.amenities || [],
      furnished: r.furnished === 'YES' ? true : r.furnished === 'NO' ? false : null,
      agent: r.agent?.name ? { name: r.agent.name, phone: r.agent.whatsapp || r.agent.phone || undefined, photo: r.agent.image?.split('?')[0] } : undefined,
      permitNumber: r.regs?.validation_url ? undefined : undefined,
      listedAt: r.listed || r.regs?.listed,
      updatedAt: snap.collectedAt,
    };
  })
  .sort((a, b) => (b.listedAt || '').localeCompare(a.listedAt || ''));

const slugs = new Set(listings.map((l) => l.slug));
if (slugs.size !== listings.length) throw new Error('Duplicate slugs');
writeFileSync(out, JSON.stringify(listings, null, 1) + '\n');
const by = (k) => listings.reduce((m, l) => ((m[l[k]] = (m[l[k]] || 0) + 1), m), {});
console.log(`${listings.length} listings written`, by('purpose'), by('completion'), by('type'));
console.log('communities:', Object.keys(by('community')).length);
