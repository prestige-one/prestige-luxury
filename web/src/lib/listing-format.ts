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

export function sortProperties<T extends { price: number; listedAt?: string; updatedAt?: string }>(list: T[], sort: SortKey): T[] {
  const out = [...list];
  if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
  else if (sort === "newest") out.sort((a, b) => time(b) - time(a));
  else if (sort === "oldest") out.sort((a, b) => time(a) - time(b));
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

/** "0 Property", "1 Property", "12 Properties" (as on the original Houzez archive). */
export const countLabel = (n: number) => `${n} ${n > 1 ? "Properties" : "Property"}`;

/** Address line under the title: most specific locations first, without repeating the city. */
export const addressLine = (p: Pick<Property, "location" | "city">) =>
  [...new Set([...p.location, p.city].filter(Boolean))].join(", ");

/** Description text → paragraphs. */
export const paragraphs = (text: string) =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

const optimizedHosts = /(^|\.)(propertyfinder\.ae|bayut\.com|bayutcdn\.com)$/i;

/** next/image can only optimise local files and the hosts configured in next.config.ts. */
export function isUnoptimized(src: string) {
  if (!/^https?:/i.test(src)) return false;
  try {
    return !optimizedHosts.test(new URL(src).hostname);
  } catch {
    return true;
  }
}
