import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/search-results/", "/advanced-search-results/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
