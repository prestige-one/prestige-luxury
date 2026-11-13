// Data helpers for the property listing pages (archives, search results, detail page). Server-side only:
// this imports the listings JSON — client components must use lib/listing-format.ts instead.
import { communities, properties, searchProperties, slugify, type Property, type SearchFilters } from "./properties";
import { parseSort, sortProperties, statuses, type SortKey, type StatusSlug } from "./listing-format";

// ---- Property types -------------------------------------------------------------------------

export const typeRoutes = [
  { slug: "apartment", label: "Apartment" },
  { slug: "villa", label: "Villa" },
  { slug: "studio", label: "Studio" },
  { slug: "townhouse", label: "Townhouse" },
  { slug: "penthouse", label: "Penthouse" },
  { slug: "office", label: "Office" },
  { slug: "other-commercial", label: "Other Commercial" },
] as const;

/** Links in the "Property Type" sidebar widget (same list as the original site). */
export const sidebarTypes = ["apartment", "studio", "villa", "townhouse", "office"].map((slug) => typeRoutes.find((t) => t.slug === slug)!);

const commercialPattern =
  /office|shop|retail|warehouse|showroom|commercial|factory|labou?r camp|business cent|land|plot|whole building|bulk|staff accommodation|industrial/i;

export const isCommercialType = (type: string) => commercialPattern.test(type);

export function propertiesOfType(slug: string, list: Property[] = properties) {
  if (slug === "other-commercial") return list.filter((p) => isCommercialType(p.type));
  return list.filter((p) => slugify(p.type) === slug);
}

// ---- Areas ----------------------------------------------------------------------------------

/** Areas linked from the homepage: their pages must exist even with no listings. */
export const featuredAreas = ["Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "Business Bay"];

const defaultAreas = [...featuredAreas, "Jumeirah Village Circle", "Dubai Hills Estate", "Jumeirah Beach Residence"];

/** Area pages linked from /dubai-neighbourhoods/ (slug → display name). They always exist, even with no listings. */
export const neighbourhoodAreas: Record<string, string> = {
  "dubai-marina": "Dubai Marina",
  "palm-jumeirah": "Palm Jumeirah",
  "downtown-dubai": "Downtown Dubai",
  "business-bay": "Business Bay",
  "jumeirah-beach-residence": "Jumeirah Beach Residence",
  "jumeirah-lake-towers": "Jumeirah Lake Towers",
  "jumeirah-village-circle": "Jumeirah Village Circle",
  "al-furjan": "Al Furjan",
  "dubai-sports-city": "Dubai Sports City",
  "mohammed-bin-rashid-city": "Mohammed Bin Rashid City",
  "the-hills": "The Hills",
  "damac-hills-2": "DAMAC Hills 2",
  "dubai-harbour": "Dubai Harbour",
  difc: "DIFC",
  meydan: "Meydan",
  "emaar-beachfront-2": "Emaar Beachfront",
  "dubai-creek-harbour": "Dubai Creek Harbour",
  "dubai-hills-estate": "Dubai Hills Estate",
  "dubai-south": "Dubai South",
  "al-sufouh": "Al Sufouh",
  "damac-lagoons": "DAMAC Lagoons",
  "maritime-city": "Maritime City",
  "dubai-land": "Dubailand",
  deira: "Deira",
  "damac-hills-akoya-by-damac": "DAMAC Hills (Akoya by DAMAC)",
  "akoya-oxygen": "Akoya Oxygen",
  "the-greens": "The Greens",
  "dubai-silicon-oasis": "Dubai Silicon Oasis",
  "the-views": "The Views",
  "dubai-production-city-impz": "Dubai Production City (IMPZ)",
  "jebel-ali": "Jebel Ali",
  "jumeirah-park": "Jumeirah Park",
  "mina-rashid": "Mina Rashid",
  "arabian-ranches": "Arabian Ranches",
  "arabian-ranches-2": "Arabian Ranches 2",
  "green-community": "Green Community",
  "jumeirah-village-triangle": "Jumeirah Village Triangle",
  "al-habtoor-city": "Al Habtoor City",
  "umm-suqeim": "Umm Suqeim",
  "the-springs": "The Springs",
  "discovery-gardens": "Discovery Gardens",
  "nadd-al-sheba": "Nad Al Sheba",
  "al-jaddaf": "Al Jaddaf",
  "barsha-heights-tecom": "Barsha Heights (TECOM)",
};

/** Every area page: communities with listings + featured/neighbourhood areas (fixed names win). */
export function allAreas(list: Property[] = properties) {
  const names = new Map<string, string>(Object.entries(neighbourhoodAreas));
  for (const n of [...featuredAreas, ...communities(list)]) {
    const slug = slugify(n ?? "");
    if (slug && !names.has(slug)) names.set(slug, n);
  }
  return [...names.entries()].map(([slug, name]) => ({ slug, name }));
}

export const areaName = (slug: string) => allAreas().find((a) => a.slug === slug)?.name;

/** Listings whose community or any location entry slugifies to the area slug (or to its display name, e.g. "emaar-beachfront-2" ↔ "Emaar Beachfront"). */
export function propertiesInArea(slug: string, list: Property[] = properties) {
  const keys = new Set([slug]);
  if (neighbourhoodAreas[slug]) keys.add(slugify(neighbourhoodAreas[slug]));
  return list.filter((p) => keys.has(slugify(p.community)) || p.location.some((l) => keys.has(slugify(l))));
}

/** Options for the "All Areas" select (falls back to well-known areas when there are no listings). */
export function areaOptions() {
  const listed = communities();
  return listed.length ? listed : defaultAreas;
}

export function cityOptions() {
  const cities = [...new Set(properties.map((p) => p.city).filter(Boolean))].sort();
  return cities.length ? cities : ["Dubai"];
}

// ---- Search ---------------------------------------------------------------------------------

export type ListingFilters = SearchFilters & { city?: string; sort?: SortKey };

type RawParams = Record<string, string | string[] | undefined>;

export function parseFilters(sp: RawParams): ListingFilters {
  const get = (k: string) => {
    const v = sp[k];
    const s = (Array.isArray(v) ? v[0] : v)?.trim();
    return s ? s : undefined;
  };
  const status = get("status");
  const beds = get("beds");
  const maxPrice = get("maxPrice");
  return {
    status: statuses.some((s) => s.slug === status) ? (status as StatusSlug) : undefined,
    location: get("location"),
    type: get("type"),
    beds: beds && /^[0-5]$/.test(beds) ? beds : undefined,
    maxPrice: maxPrice && /^\d+$/.test(maxPrice) ? maxPrice : undefined,
    q: get("q"),
    city: get("city"),
    sort: parseSort(get("sort")),
  };
}

export function filterListings(f: ListingFilters, list: Property[] = properties) {
  let out = list;
  // "Other Commercial" in the type select means every commercial type
  if (f.type && slugify(f.type) === "other-commercial") {
    out = propertiesOfType("other-commercial", out);
    f = { ...f, type: undefined };
  }
  if (f.city) out = out.filter((p) => p.city.toLowerCase() === f.city!.toLowerCase());
  return searchProperties(f, out);
}

// ---- Widgets --------------------------------------------------------------------------------

export const featuredListings = (n = 3) => sortProperties(properties, "newest").slice(0, n);

export function similarListings(p: Property, n = 3) {
  const others = properties.filter((o) => o.id !== p.id && o.purpose === p.purpose);
  const score = (o: Property) => (o.community === p.community ? 2 : 0) + (o.type === p.type ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, n);
}
