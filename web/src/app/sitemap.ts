import type { MetadataRoute } from "next";
import { categories, pages, posts } from "@/lib/content";
import { properties, slugify } from "@/lib/properties";
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

  entries.push({ url: url("/properties/"), priority: 0.9 });
  for (const s of ["for-rent", "for-sale", "off-plan"]) entries.push({ url: url(`/status/${s}/`), priority: 0.8 });
  for (const p of properties) entries.push({ url: url(`/property/${p.slug}/`), lastModified: p.updatedAt, priority: 0.8 });
  for (const c of new Set(properties.map((p) => slugify(p.community)))) entries.push({ url: url(`/area/${c}/`), priority: 0.6 });

  return entries;
}
