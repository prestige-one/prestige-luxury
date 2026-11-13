// Pure listing helpers (no data import) — safe to use in client components.
import type { Property } from "./properties";

export type SortKey = "default" | "newest" | "oldest" | "price-asc" | "price-desc";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "default", label: "Default Order" },
  { value: "price-asc", label: "Price - Low to High" },
  { value: "price-desc", label: "Price - High to Low" },
  { value: "newest", label: "Date - New to Old" },
  { value: "oldest", label: "Date - Old to New" },
];

export const parseSort = (s?: string): SortKey => (sortOptions.some((o) => o.value === s) ? (s as SortKey) : "default");

const time = (p: { listedAt?: string; updatedAt?: string }) => Date.parse(p.listedAt ?? p.updatedAt ?? "") || 0;

type Priced = { price: number; purpose?: Property["purpose"]; rentFrequency?: Property["rentFrequency"] };

const perYear = { yearly: 1, monthly: 12, weekly: 52, daily: 365 } as const;

/** Rents are quoted per cheque period; compare them as a yearly figure. Sale prices are used as-is. */
export const yearlyPrice = (p: Priced) => (p.purpose === "rent" ? p.price * perYear[p.rentFrequency ?? "yearly"] : p.price);

/** A sale price and a yearly rent are not on the same scale, so price sorting keeps them apart. */
const purposeRank = (p: Priced) => (p.purpose === "rent" ? 1 : 0);

export function sortProperties<T extends Priced & { listedAt?: string; updatedAt?: string }>(list: T[], sort: SortKey): T[] {
  const out = [...list];
  if (sort === "price-asc") out.sort((a, b) => purposeRank(a) - purposeRank(b) || yearlyPrice(a) - yearlyPrice(b));
  else if (sort === "price-desc") out.sort((a, b) => purposeRank(a) - purposeRank(b) || yearlyPrice(b) - yearlyPrice(a));
  else if (sort === "newest") out.sort((a, b) => time(b) - time(a));
  else if (sort === "oldest") out.sort((a, b) => time(a) - time(b));
  return out;
}

/**
 * Budget ladder for the "Max. Price" selects. Buying and renting are quoted on completely
 * different scales, so each band holds the sale figure and the matching yearly rent; the
 * select shows one side of the ladder and `budgetCaps()` turns the chosen figure back into
 * a cap for each purpose, so a mixed archive can't match every rental on a sale-sized budget.
 */
export const budgetBands: { sale: number; rent: number }[] = [
  { sale: 500_000, rent: 50_000 },
  { sale: 1_000_000, rent: 100_000 },
  { sale: 2_000_000, rent: 150_000 },
  { sale: 3_000_000, rent: 200_000 },
  { sale: 5_000_000, rent: 300_000 },
  { sale: 10_000_000, rent: 500_000 },
  { sale: 20_000_000, rent: 1_000_000 },
  { sale: 50_000_000, rent: 2_000_000 },
];

export const budgetOptions = (status?: string) => budgetBands.map((b) => (status === "for-rent" ? b.rent : b.sale));

/**
 * The band a `?maxPrice=` value belongs to → a cap for sale listings and one for yearly rents.
 * Which ladder the number came from follows the status when there is one; otherwise the sale
 * ladder wins unless the figure is below its first band (then it can only be a rent budget).
 */
export function budgetCaps(maxPrice: number, status?: string): { sale: number; rent: number } {
  const rentScale = status === "for-rent" || maxPrice < budgetBands[0].sale;
  const key = rentScale ? "rent" : "sale";
  const band = budgetBands.find((b) => b[key] >= maxPrice) ?? budgetBands[budgetBands.length - 1];
  // Keep the figure the visitor picked as the cap on its own scale; pair the other scale to the band.
  return rentScale ? { rent: maxPrice, sale: band.sale } : { sale: maxPrice, rent: band.rent };
}

/** Listings per archive/search page. */
export const PAGE_SIZE = 12;

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));

/** `?page=` → a page number inside the available range. */
export const parsePage = (value: string | undefined, total: number) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, pageCount(total)) : 1;
};

/**
 * The page numbers to show: first, last, the current page and its neighbours, with gaps
 * collapsed to an ellipsis — e.g. [1, "…", 7, 8, 9, "…", 15]. Keeps the control on one row
 * at 375px however many pages there are.
 */
export function pageWindow(current: number, pages: number): (number | "…")[] {
  const wanted = new Set([1, pages, current - 1, current, current + 1]);
  const shown = [...wanted].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (const [i, n] of shown.entries()) {
    const prev = shown[i - 1];
    if (prev && n - prev > 1) out.push(n - prev === 2 ? n - 1 : "…");
    out.push(n);
  }
  return out;
}

export const statuses = [
  { slug: "for-rent", label: "For Rent" },
  { slug: "for-sale", label: "For Sale" },
  { slug: "off-plan", label: "Off-Plan" },
] as const;
export type StatusSlug = (typeof statuses)[number]["slug"];

export const statusLabel = (slug: string) => statuses.find((s) => s.slug === slug)?.label;

/** The label shown on a card / detail page. */
export function propertyStatus(p: Pick<Property, "purpose" | "completion">): { slug: StatusSlug; label: string } {
  if (p.completion === "off-plan") return { slug: "off-plan", label: "Off-Plan" };
  return p.purpose === "rent" ? { slug: "for-rent", label: "For Rent" } : { slug: "for-sale", label: "For Sale" };
}

export const bedsLabel = (b: number | null) => (b === null ? null : b === 0 ? "Studio" : `${b} ${b === 1 ? "Bed" : "Beds"}`);

export const sqft = (n: number) => `${new Intl.NumberFormat("en-AE").format(n)} Sq Ft`;

/** "0 Properties", "1 Property", "12 Properties" (as on the original Houzez archive). */
export const countLabel = (n: number) => `${n} ${n === 1 ? "Property" : "Properties"}`;

/** Address line under the title: most specific locations first, without repeating the city. */
export const addressLine = (p: Pick<Property, "location" | "city">) =>
  [...new Set([...p.location, p.city].filter(Boolean))].join(", ");

/** Description text → paragraphs. */
export const paragraphs = (text: string) =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

// ---- Markdown in feed text ------------------------------------------------------------------
// Portal descriptions are typed by agents and arrive with markdown left in: `**bold**` runs and
// `* item` bullet lines. Rendering them verbatim puts literal asterisks on the page and in the
// SERP snippet, so everything that displays description text goes through the helpers below.
// (The JSON itself is written by the listings sync and is never rewritten here.)

/** `* item` lines → the `• item` bullets the rest of the feed uses. */
const bullets = (text: string) => text.replace(/^[ \t]*\*[ \t]+/gm, "• ");

export type TextSegment = { text: string; bold?: boolean };

/** Description text → paragraphs of bold/plain runs, with markdown bullets normalised. */
export function richParagraphs(text: string): TextSegment[][] {
  return paragraphs(bullets(text)).map((p) =>
    p
      .split(/\*\*([\s\S]+?)\*\*/g)
      .map((part, i) => (i % 2 ? { text: part.trim(), bold: true } : { text: part.replace(/\*/g, "") }))
      .filter((s) => s.text !== ""),
  );
}

/** Description text with every markdown marker removed — for meta descriptions and JSON-LD. */
export const plainText = (text: string) =>
  bullets(text)
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Listing photos come straight from the portals' own image CDNs, which already serve
 * resized JPEGs. We don't run them through Vercel's image optimiser (thousands of photos
 * would exhaust its monthly quota), so every remote image is served as-is.
 */
export function isUnoptimized(src: string) {
  return /^https?:/i.test(src);
}

/**
 * Property Finder photo URLs end in a size, e.g. ".../1312x894.jpg". Ask the CDN for a
 * smaller variant for cards and thumbnails. Other URLs are returned unchanged.
 */
export function sizedImage(src: string, size: "thumb" | "card" | "full" = "card") {
  const dims = { thumb: "416x272", card: "668x452", full: "1312x894" }[size];
  return src.replace(/(static\.shared\.propertyfinder\.ae\/media\/images\/listing\/.+\/)\d+x\d+(\.\w+)$/, `$1${dims}$2`);
}
