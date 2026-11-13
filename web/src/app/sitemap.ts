import type { MetadataRoute } from "next";
import { categories, pages, posts } from "@/lib/content";
import { developers } from "@/lib/developers";
import { statuses } from "@/lib/listing-format";
import { allAreas, typeRoutes } from "@/lib/listing-views";
import { properties } from "@/lib/properties";
import { site } from "@/lib/site";

// Pages that exist only for WordPress features we dropped, or that shouldn't be indexed.
const skip = new Set([
  "/advanced-search-results/", "/search-results/", "/complete-order/", "/create-listing/", "/insights/", "/board/",
  "/saved-search/", "/membership-info/", "/stripe/", "/select-your-package/", "/compare-properties/",
  "/favorite-properties/", "/my-properties/", "/my-profile/", "/test-landing-page/", "/agents/", "/blog/",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const entries: MetadataRoute.Sitemap = [];

  for (const p of pages) {
    if (skip.has(p.path) || p.path.startsWith("/thank-you") || /%[0-9a-f]{2}/i.test(p.path)) continue;
    entries.push({ url: url(p.path), lastModified: p.modified, priority: p.path === "/" ? 1 : 0.7 });
  }
  entries.push({ url: url("/blog/"), lastModified: posts[0]?.modified, priority: 0.7 });
  for (const p of posts) entries.push({ url: url(p.path), lastModified: p.modified, priority: 0.5 });
  for (const c of categories) if (c.count > 0) entries.push({ url: url(c.path), priority: 0.3 });

  // Listing routes come from the same lists the routes themselves are generated from
  // (lib/listing-format, lib/listing-views), so the sitemap can't drift away from them —
  // that is how the /property-type/ pages and the listing-less area pages went missing.
  entries.push({ url: url("/properties/"), priority: 0.9 });
  for (const s of statuses) entries.push({ url: url(`/status/${s.slug}/`), priority: 0.8 });
  for (const t of typeRoutes) entries.push({ url: url(`/property-type/${t.slug}/`), priority: 0.6 });
  for (const p of properties) entries.push({ url: url(`/property/${p.slug}/`), lastModified: p.updatedAt, priority: 0.8 });
  for (const a of allAreas()) entries.push({ url: url(`/area/${a.slug}/`), priority: 0.6 });

  // Developer directory — derived from content/developers.json, the same list the routes are
  // generated from, so new developers appear here as soon as they are added to the data.
  entries.push({ url: url("/developers/"), priority: 0.7 });
  for (const d of developers) entries.push({ url: url(`/developers/${d.slug}/`), priority: 0.6 });

  return entries;
}
