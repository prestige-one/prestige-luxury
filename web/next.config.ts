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
