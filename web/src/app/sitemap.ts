import type { MetadataRoute } from "next";
import { categories, pages, posts } from "@/lib/content";
import { developers } from "@/lib/developers";
import { statuses } from "@/lib/listing-format";
import { allAreas, typeRoutes } from "@/lib/listing-views";
import { properties } from "@/lib/properties";
import { isPagePublished, site } from "@/lib/site";
import { pageCount } from "@/components/blog/blog";

// Pages that exist only for WordPress features we dropped, or that shouldn't be indexed.
const skip = new Set([
  "/advanced-search-results/", "/search-results/", "/complete-order/", "/create-listing/", "/insights/", "/board/",
  "/saved-search/", "/membership-info/", "/stripe/", "/select-your-package/", "/compare-properties/",
  "/favorite-properties/", "/my-properties/", "/my-profile/", "/test-landing-page/", "/agents/", "/blog/",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const entries: MetadataRoute.Sitemap = [];
  const staticPaths = new Set([
    "/", "/about/", "/contact-us/", "/sell/", "/careers/", "/meet-the-team/",
    "/testimonials/", "/services/", "/services/property-management/", "/services/market-appraisal/",
    "/areas/", "/dubai-neighbourhoods/", "/signature-living/", "/frequently-asked-questions/",
    "/privacy-policy/", "/terms-and-conditions/", "/inquiry-form/",
    "/projects-for-sale/", "/projects-for-sale-arabic/", "/prestige-embankment/", "/orra-embankment/",
    "/the-residence-by-prestige-one/", "/vista-by-prestige-one/", "/property-quiz/",
  ]);

  for (const p of pages) {
    if (!staticPaths.has(p.path) || skip.has(p.path)) continue;
    entries.push({ url: url(p.path), lastModified: p.modified, priority: p.path === "/" ? 1 : 0.7 });
  }
  entries.push({ url: url("/blog/"), lastModified: posts[0]?.modified, priority: 0.7 });
  for (let n = 2; n <= pageCount(posts.length); n++) entries.push({ url: url(`/blog/page/${n}/`), priority: 0.4 });
  for (const p of posts) entries.push({ url: url(p.path), lastModified: p.modified, priority: 0.5 });
  for (const c of categories) {
    const list = posts.filter((post) => post.categories.includes(c.id));
    if (!list.length) continue;
    entries.push({ url: url(c.path), lastModified: list[0]?.modified, priority: 0.4 });
    for (let n = 2; n <= pageCount(list.length); n++) entries.push({ url: url(`${c.path}page/${n}/`), priority: 0.3 });
  }

  // Listing routes come from the same lists the routes themselves are generated from
  // (lib/listing-format, lib/listing-views), so the sitemap can't drift away from them —
  // that is how the /property-type/ pages and the listing-less area pages went missing.
  entries.push({ url: url("/properties/"), priority: 0.9 });
  entries.push({ url: url("/exclusive-collection/"), priority: 0.8 });
  for (const s of statuses) entries.push({ url: url(`/status/${s.slug}/`), priority: 0.8 });
  for (const t of typeRoutes) entries.push({ url: url(`/property-type/${t.slug}/`), priority: 0.6 });
  for (const p of properties) entries.push({ url: url(`/property/${p.slug}/`), lastModified: p.updatedAt, priority: 0.8 });
  for (const a of allAreas()) entries.push({ url: url(`/area/${a.slug}/`), priority: 0.6 });

  // Developer directory — derived from content/developers.json, the same list the routes are
  // generated from, so new developers appear here as soon as they are added to the data.
  entries.push({ url: url("/developers/"), priority: 0.7 });
  for (const d of developers) entries.push({ url: url(`/developers/${d.slug}/`), priority: 0.6 });

  // Guides written for the new site (not in the WordPress import, so listed by hand)
  entries.push({ url: url("/buyers-guide/"), priority: 0.7 });
  entries.push({ url: url("/tenants-guide/"), priority: 0.7 });
  entries.push({ url: url("/investment-guide/"), priority: 0.7 });

  return [...new Map(entries.filter((entry) => isPagePublished(entry.url)).map((entry) => [entry.url, entry])).values()];
}
