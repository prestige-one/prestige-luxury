// Editorial photography, taken from the agency's own listings.
//
// The 193 live listings carry over 4,400 professional photographs of real Dubai property.
// That is far better material than the ageing stock and blog images in /wp-content, and it
// refreshes by itself every time the Property Finder / Bayut feed is re-imported.
//
// Nothing here hard-codes a photo URL. A listing that sells leaves the feed, and a pinned
// URL would leave a hole on the page; choosing by rule means the next build simply picks
// another photo of the same community.
//
// Server-side only: this imports the listings JSON. Client components must be passed the
// resulting string, not this module.
import { sizedImage } from "./listing-format";
import { properties, slugify, type Property } from "./properties";

export type PhotoSize = "thumb" | "card" | "full";

/** Listings worth taking a hero shot from: plenty of photos, so the first one is usually styled. */
function candidates(list: Property[]) {
  return list
    .filter((p) => p.images.length >= 6)
    .sort((a, b) => b.images.length - a.images.length || a.id.localeCompare(b.id)); // id breaks ties so builds are stable
}

const byCommunity = new Map<string, Property[]>();
for (const p of properties) {
  const key = slugify(p.community);
  if (!byCommunity.has(key)) byCommunity.set(key, []);
  byCommunity.get(key)!.push(p);
}

/**
 * A representative photograph of a community, or null when we have no listing there.
 * `skip` steps to the next-best listing, so a page can show several without repeating.
 */
export function communityPhoto(community: string, { size = "card", skip = 0 }: { size?: PhotoSize; skip?: number } = {}): string | null {
  const list = candidates(byCommunity.get(slugify(community)) ?? []);
  const chosen = list[skip % list.length || 0];
  return chosen ? sizedImage(chosen.images[0], size) : null;
}

/** Several distinct photographs of one community, best first; may return fewer than asked. */
export function communityPhotos(community: string, count: number, size: PhotoSize = "card"): string[] {
  const list = candidates(byCommunity.get(slugify(community)) ?? []);
  return list.slice(0, count).map((p) => sizedImage(p.images[0], size));
}

/**
 * A photograph for a section that is not about one community — chosen from the
 * best-photographed listings across the whole portfolio. `seed` only has to be stable and
 * unique per slot (the section's heading works well); the same seed always yields the same
 * photo, so pages do not reshuffle between builds.
 */
const pool = candidates(properties);

export function featurePhoto(seed: string, size: PhotoSize = "full"): string | null {
  if (!pool.length) return null;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return sizedImage(pool[h % pool.length].images[0], size);
}

/** Distinct photographs for a run of slots on one page, so none repeats. */
export function featurePhotos(seeds: string[], size: PhotoSize = "card"): (string | null)[] {
  const used = new Set<string>();
  return seeds.map((seed) => {
    for (let attempt = 0; attempt < pool.length; attempt++) {
      const src = featurePhoto(`${seed}#${attempt}`, size);
      if (!src || !used.has(src)) {
        if (src) used.add(src);
        return src;
      }
    }
    return null;
  });
}
