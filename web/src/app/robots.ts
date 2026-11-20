import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { site } from "@/lib/site";

/**
 * Until the real domain points here, the site is served from *.vercel.app. Every canonical
 * URL already points at prestigeluxury.ae, so letting search engines index the preview host
 * would create duplicate content. Preview responses have X-Robots-Tag: noindex, follow;
 * allow crawling so search engines can read that header and the production canonicals.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  const isProductionDomain = host === new URL(site.url).host || host.endsWith(".prestigeluxury.ae");

  if (!isProductionDomain) {
    return { rules: { userAgent: "*", allow: "/", disallow: "/api/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
