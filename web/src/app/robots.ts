import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { site } from "@/lib/site";

/**
 * Until the real domain points here, the site is served from *.vercel.app. Every canonical
 * URL already points at prestigeluxury.ae, so letting search engines index the preview host
 * would create duplicate content. Block anything that is not the production domain.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  const isProductionDomain = host === new URL(site.url).host || host.endsWith(".prestigeluxury.ae");

  if (!isProductionDomain) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/search-results/", "/advanced-search-results/", "/tag/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
