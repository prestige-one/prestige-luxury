import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the same URLs as the old WordPress site (they all end with "/").
  trailingSlash: true,
  images: {
    remotePatterns: [
      // Listing photos synced from Property Finder / Bayut
      { protocol: "https", hostname: "**.propertyfinder.ae" },
      { protocol: "https", hostname: "**.bayut.com" },
      { protocol: "https", hostname: "**.bayutcdn.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/home/", destination: "/", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wakanda/", destination: "/", permanent: false },
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/our-story/", destination: "/about/", permanent: true },
      { source: "/list-with-us/", destination: "/sell/", permanent: true },
      // Old WordPress URLs still linked from blog posts and from the web
      { source: "/property-management/", destination: "/services/property-management/", permanent: true },
      { source: "/market-appraisal/", destination: "/services/market-appraisal/", permanent: true },
      { source: "/advanced-search/", destination: "/search-results/", permanent: true },
      { source: "/properties/rentals/:slug*", destination: "/status/for-rent/", permanent: true },
      { source: "/properties/sales/:slug*", destination: "/status/for-sale/", permanent: true },
      { source: "/properties/:slug+", destination: "/properties/", permanent: true },
      // Houzez taxonomy URLs used by the old site
      { source: "/status/:slug/page/:n", destination: "/status/:slug/", permanent: true },
      // Blog post deleted years ago but still linked from another post
      { source: "/places-to-eat-out-in-ramadan-2019-under-100-aed/", destination: "/blog/", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
