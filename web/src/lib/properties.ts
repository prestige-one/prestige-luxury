// Property listings shown on the website.
// content/properties.json is written by the listings sync (scripts/sync-listings) from
// Property Finder / Bayut. Pages must render fine when it is empty.
import listingsJson from "../../content/properties.json";

export type Purpose = "sale" | "rent";
export type Completion = "ready" | "off-plan";

export type Property = {
  /** Stable id, e.g. "pf-12345" or "bayut-67890" */
  id: string;
  /** URL slug, unique */
  slug: string;
  /** Agency reference number (shared between portals when the same listing is on both) */
  reference: string;
  source: "propertyfinder" | "bayut";
  sourceUrl: string;
  title: string;
  description: string; // plain text, paragraphs separated by blank lines
  purpose: Purpose;
  completion: Completion;
  /** e.g. "Apartment", "Villa", "Townhouse", "Penthouse", "Studio", "Office" */
  type: string;
  price: number; // AED; for rent this is per `rentFrequency`
  rentFrequency?: "yearly" | "monthly" | "weekly" | "daily";
  bedrooms: number | null; // 0 = studio
  bathrooms: number | null;
  sizeSqft: number | null;
  /** Most specific first, e.g. ["Marina Gate 1", "Dubai Marina", "Dubai"] */
  location: string[];
  community: string; // e.g. "Dubai Marina"
  city: string; // e.g. "Dubai"
  coordinates?: { lat: number; lng: number };
  images: string[];
  amenities: string[];
  furnished?: boolean | null;
  agent?: { name: string; phone?: string; email?: string; photo?: string };
  permitNumber?: string; // RERA / DLD permit
  listedAt?: string; // ISO date
  updatedAt?: string; // ISO date
};

export const properties = listingsJson as unknown as Property[];

export const getProperty = (slug: string) => properties.find((p) => p.slug === slug);

export const propertyTypes = ["Apartment", "Villa", "Townhouse", "Penthouse", "Studio", "Office", "Other Commercial"];

export function formatPrice(p: Pick<Property, "price" | "purpose" | "rentFrequency">) {
  const n = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(p.price);
  if (p.purpose === "rent") {
    const per = { yearly: "/year", monthly: "/month", weekly: "/week", daily: "/day" }[p.rentFrequency ?? "yearly"];
    return `AED ${n}${per}`;
  }
  return `AED ${n}`;
}

export type SearchFilters = {
  status?: "for-rent" | "for-sale" | "off-plan";
  location?: string;
  type?: string;
  beds?: string; // "0" (studio) .. "5" (5+)
  maxPrice?: string;
  q?: string;
};

const normaliseSearch = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();
const locationMatches = (value: string, query: string, exact: boolean) =>
  exact ? normaliseSearch(value) === query : normaliseSearch(value).includes(query);
const atLocation = (property: Property, location: string, exact = true) =>
  locationMatches(property.community, location, exact) || locationMatches(property.city, location, exact)
  || property.location.some((value) => locationMatches(value, location, exact));

export function searchProperties(f: SearchFilters, list: Property[] = properties, locationSource: Property[] = list) {
  const query = f.q && normaliseSearch(f.q);
  const location = f.location && normaliseSearch(f.location);
  // Resolve the location before purpose, type or budget filters. A rent-only building must
  // produce zero sales, rather than unrelated sales whose titles advertise a view of it.
  const queryIsLocation = query && locationSource.some((property) => atLocation(property, query));
  return list.filter((p) => {
    if (f.status === "for-rent" && p.purpose !== "rent") return false;
    if (f.status === "for-sale" && p.purpose !== "sale") return false;
    if (f.status === "off-plan" && p.completion !== "off-plan") return false;
    if (location && !atLocation(p, location)) return false;
    if (f.type && p.type.toLowerCase() !== f.type.toLowerCase()) return false;
    if (f.beds) {
      const b = Number(f.beds);
      if (b >= 5 ? (p.bedrooms ?? -1) < 5 : p.bedrooms !== b) return false;
    }
    if (f.maxPrice && p.price > Number(f.maxPrice)) return false;
    if (query && !atLocation(p, query, !!queryIsLocation)) return false;
    return true;
  });
}

/** All communities that have at least one listing, sorted by number of listings. */
export function communities(list: Property[] = properties) {
  const counts = new Map<string, number>();
  for (const p of list) counts.set(p.community, (counts.get(p.community) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
