import type { Metadata } from "next";
import { parsePage } from "./listing-format";
import { site } from "./site";

export const defaultSocialImage = "/images/seo/prestige-luxury-social.webp";
export const nonIndexablePaths = new Set([
  "/property-quiz/", "/inquiry-form/", "/search-results/", "/advanced-search-results/", "/featured-display-screen/",
  "/thank-you/", "/thank-you-vista/", "/thank-you-the-residence/", "/thank-you-projects/", "/thank-you-embankment/", "/thank-you-embankment-2/",
]);
type QueryValue = string | string[] | undefined;

export function seoText(value: string) {
  const entities: Record<string, string> = { amp: "&", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };
  return value.replace(/<[^>]*>/g, " ").replace(/&([a-z]+);/gi, (match, name: string) => entities[name.toLowerCase()] ?? match)
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code: string) => {
      const point = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
      return point <= 0x10ffff ? String.fromCodePoint(point) : "";
    }).replace(/\s+/g, " ").trim();
}

export function shortenSeoText(value: string, max = 160) {
  const text = seoText(value);
  if (text.length <= max) return text;
  const boundary = text.lastIndexOf(" ", max - 1);
  return `${text.slice(0, boundary > max * 0.6 ? boundary : max - 1).replace(/[\s,;:—–-]+$/, "")}…`;
}

export function brandedTitle(value: string, max = 70) {
  const text = seoText(value).replace(/\s*[|•–—-]\s*Prestige(?: Luxury)?(?: Real Estate)?\s*$/i, "");
  const suffix = " | Prestige Luxury";
  return `${shortenSeoText(text, max - suffix.length)}${suffix}`;
}

/** Metadata follows the same clamped page numbers as the rendered listing collections. */
export function pageMetadata({ title, description, path, image = defaultSocialImage, pagination = [], canonicalParams = {} }: {
  title: string; description: string; path: string; image?: string | null;
  pagination?: { key: string; value: QueryValue; total: number }[];
  canonicalParams?: Record<string, string>;
}): Metadata {
  const query = new URLSearchParams(canonicalParams);
  const labels: string[] = [];
  for (const { key, value, total } of pagination) {
    const page = parsePage(Array.isArray(value) ? value[0] : value, total);
    if (page > 1) {
      query.set(key, String(page));
      labels.push(`${key === "projectPage" ? "Projects page" : "Page"} ${page}`);
    }
  }
  const canonical = `${path}${query.size ? `?${query}` : ""}`;
  const pageSuffix = ` – ${labels.join(", ")} | Prestige Luxury`;
  const pageTitle = labels.length ? `${shortenSeoText(title.replace(/\s*\|.*$/, ""), 70 - pageSuffix.length)}${pageSuffix}` : title;
  const summary = shortenSeoText(description);
  const socialImage = image || defaultSocialImage;
  return {
    title: { absolute: pageTitle }, description: summary,
    alternates: { canonical },
    openGraph: { title: pageTitle, description: summary, url: canonical, siteName: site.name, type: "website",
      images: [{ url: socialImage, alt: pageTitle, ...(socialImage === defaultSocialImage ? { width: 1200, height: 630 } : {}) }] },
    twitter: { card: "summary_large_image", title: pageTitle, description: summary, images: [socialImage] },
  };
}

/** Keep trustworthy feed timestamps; timezone-less WordPress dates use date-only W3C format. */
export function sitemapDate(value?: string | null): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(value)) return undefined;
  if (!Number.isFinite(Date.parse(value))) return undefined;
  if (new Date(`${value.slice(0, 10)}T00:00:00Z`).toISOString().slice(0, 10) !== value.slice(0, 10)) return undefined;
  return /T/.test(value) && /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? new Date(value).toISOString() : value.slice(0, 10);
}

export function latestSitemapDate(values: (string | undefined | null)[]) {
  return values.map(sitemapDate).filter((value): value is string => !!value).sort().at(-1);
}
