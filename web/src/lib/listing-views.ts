// Data helpers for the property listing pages (archives, search results, detail page). Server-side only:
// this imports the listings JSON — client components must use lib/listing-format.ts instead.
import { communities, formatPrice, properties, propertyTypes, searchProperties, slugify, type Property, type SearchFilters } from "./properties";
import {
  bedsLabel,
  budgetCaps,
  parseSort,
  propertyStatus,
  sortProperties,
  sqft,
  statuses,
  yearlyPrice,
  type SortKey,
  type StatusSlug,
} from "./listing-format";
import { site } from "./site";

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

/**
 * Studios are listed by the portals either with `type: "Studio"` or as an apartment with
 * no bedroom, so both count — otherwise /property-type/studio/ sits empty next to 23 studios.
 */
export const isStudio = (p: Pick<Property, "type" | "bedrooms">) => slugify(p.type) === "studio" || p.bedrooms === 0;

export function propertiesOfType(slug: string, list: Property[] = properties) {
  if (slug === "other-commercial") return list.filter((p) => isCommercialType(p.type));
  if (slug === "studio") return list.filter(isStudio);
  return list.filter((p) => slugify(p.type) === slug);
}

/**
 * Options for the "Property type" select on the archives: the canonical list, minus the types
 * no listing has (an always-empty option is just noise). Derived from the data, so a type comes
 * back by itself as soon as the feed has one.
 */
export function searchTypeOptions(list: Property[] = properties) {
  return propertyTypes.filter((label) => propertiesOfType(slugify(label), list).length > 0);
}

// ---- Areas ----------------------------------------------------------------------------------

/** Areas linked from the homepage: their pages must exist even with no listings. */
export const featuredAreas = ["Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "Business Bay"];

const defaultAreas = [...featuredAreas, "Jumeirah Village Circle", "Dubai Hills Estate", "Jumeirah Beach Residence"];

/** Area pages linked from /dubai-neighbourhoods/ (slug → display name). They always exist, even with no listings. */
export const neighbourhoodAreas: Record<string, string> = {
  "meydan-horizon": "Meydan Horizon",
  "dubai-maritime-city": "Dubai Maritime City",
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

/** Only location strings cross into the autocomplete client, never the listing records. */
export function locationOptions() {
  return [...new Set(properties.flatMap((property) => [property.community, property.city, ...property.location]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
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
  // "Other Commercial" / "Studio" in the type select cover more than one feed type
  const typeSlug = f.type && slugify(f.type);
  if (typeSlug === "other-commercial" || typeSlug === "studio") {
    out = propertiesOfType(typeSlug, out);
    f = { ...f, type: undefined };
  }
  if (f.city) out = out.filter((p) => p.city.toLowerCase() === f.city!.toLowerCase());
  // The budget is handled here, not in searchProperties, so that each listing is measured
  // against the cap for its own purpose (yearly rent vs sale price).
  if (f.maxPrice) {
    const caps = budgetCaps(Number(f.maxPrice), f.status);
    out = out.filter((p) => yearlyPrice(p) <= (p.purpose === "rent" ? caps.rent : caps.sale));
    f = { ...f, maxPrice: undefined };
  }
  return searchProperties(f, out);
}

// ---- Listing SEO ----------------------------------------------------------------------------

/** "Marina Gate 1, Dubai Marina" — building and community, without the rest of the address. */
const listingPlace = (p: Property) =>
  [...new Set([p.location[0], p.community, p.city].filter(Boolean))].slice(0, 2).join(", ");

/** "<beds> <type> in <community>" — the readable part of a listing title. */
const listingSummary = (p: Property) => [bedsLabel(p.bedrooms), p.type, "in", p.community || p.city].filter(Boolean).join(" ");

/**
 * Feed titles are marketing lines ("Agent on Site | Modern | Brand New 1BR") and a dozen
 * listings share one, so the `<title>` adds what the listing actually is. Where even that
 * repeats — same feed title, beds, type and community — the agency reference settles it.
 */
const ambiguousTitles = (() => {
  const seen = new Map<string, number>();
  for (const p of properties) {
    const key = `${p.title} — ${listingSummary(p)}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return new Set([...seen].filter(([, n]) => n > 1).map(([key]) => key));
})();

/** References look like "prestigedubai-133632001748C"; the agency number alone is enough. */
const shortRef = (p: Property) => p.reference.split("-").pop() || p.reference;

export function listingTitle(p: Property) {
  const base = `${p.title} — ${listingSummary(p)}`;
  return ambiguousTitles.has(base) ? `${base} (Ref ${shortRef(p)})` : base;
}

/**
 * Meta description built from the listing's own facts. The raw feed description is a bullet
 * dump ("Property Highlights: • Brand New and Modern • …") that several listings share word
 * for word, which made 7 pages compete with one snippet.
 */
const MAX_DESCRIPTION = 160;

export function listingDescription(p: Property) {
  const kind = p.bedrooms === null ? p.type : p.bedrooms === 0 ? "Studio" : `${bedsLabel(p.bedrooms)} ${p.type}`;
  const tail = `Ref ${shortRef(p)}, ${site.name}.`;
  const facts = [
    p.bathrooms !== null && `${p.bathrooms} ${p.bathrooms === 1 ? "bathroom" : "bathrooms"}`,
    p.sizeSqft !== null && sqft(p.sizeSqft).toLowerCase(),
    p.furnished === true ? "furnished" : p.furnished === false ? "unfurnished" : null,
    p.completion === "off-plan" ? "off-plan handover" : null,
  ].filter(Boolean) as string[];

  // Shorten the address, then drop the least important facts, until the snippet fits in what
  // a search result actually shows. The reference always stays — it keeps every page distinct.
  const places = [...new Set([listingPlace(p), p.community || p.city])];
  let shortest = "";
  for (const place of places) {
    const lead = `${kind} ${propertyStatus(p).label.toLowerCase()} in ${place} — ${formatPrice(p)}.`;
    for (let n = facts.length; n >= 0; n--) {
      const line = n ? `${lead} ${facts.slice(0, n).join(", ").replace(/^./, (c) => c.toUpperCase())}. ${tail}` : `${lead} ${tail}`;
      if (line.length <= MAX_DESCRIPTION) return line;
      shortest = line;
    }
  }
  return shortest;
}

// ---- Widgets --------------------------------------------------------------------------------

export const featuredListings = (n = 3) => sortProperties(properties, "newest").slice(0, n);

export function similarListings(p: Property, n = 3) {
  const others = properties.filter((o) => o.id !== p.id && o.purpose === p.purpose);
  const score = (o: Property) => (o.community === p.community ? 2 : 0) + (o.type === p.type ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, n);
}
