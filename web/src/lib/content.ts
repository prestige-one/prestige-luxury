// Read-only access to the content copied from the old WordPress site (see /content/*.json).
import pagesJson from "../../content/pages.json";
import postsJson from "../../content/posts.json";
import categoriesJson from "../../content/categories.json";
import tagsJson from "../../content/tags.json";
import testimonialsJson from "../../content/testimonials.json";

export type Seo = { title: string; description: string; ogImage: string };

export type Page = {
  id: number;
  slug: string;
  parent: number;
  path: string;
  title: string;
  template: string;
  modified: string;
  seo: Seo;
  html: string;
};

export type Post = {
  id: number;
  slug: string;
  path: string;
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  image: string;
  author: string;
  categories: number[];
  tags: number[];
  seo: Seo;
  html: string;
};

export type Category = { id: number; slug: string; name: string; parent: number; count: number; path: string };
export type Tag = { id: number; slug: string; name: string };

export const pages = pagesJson as Page[];
export const posts = postsJson as Post[]; // newest first
export const categories = categoriesJson as Category[];
export const tags = tagsJson as Tag[];
export const testimonials = testimonialsJson as { id: number; name: string; html: string; image: string }[];

export const getPage = (path: string) => pages.find((p) => p.path === path);
export const getPost = (path: string) => posts.find((p) => p.path === path);
export const getCategory = (id: number) => categories.find((c) => c.id === id);
export const postsInCategory = (id: number) => posts.filter((p) => p.categories.includes(id));

/**
 * Descriptions written for pages whose WordPress ones were unusable — three pages shared one
 * boilerplate paragraph, and a few held raw page text starting with the heading in capitals.
 * Google rewrites duplicate descriptions, so each page gets its own.
 */
const descriptionOverrides: Record<string, string> = {
  "/about/":
    "Prestige Luxury Real Estate is an established Dubai agency bringing together market expertise and a commitment to exceptional client experiences. Read our story.",
  "/areas/":
    "Explore the Dubai communities Prestige Luxury Real Estate works across, and the sales, leasing, off-plan and property management services we provide in each.",
  "/meet-the-team/":
    "Meet the brokers and property specialists at Prestige Luxury Real Estate in Dubai Marina — the people who advise our buyers, sellers, landlords and tenants.",
  "/careers/":
    "Build a real estate career in Dubai with Prestige Luxury Real Estate. See what we look for, what we offer our agents, and apply to join the team.",
  "/services/":
    "Residential and commercial real estate services in Dubai: buying, selling, leasing, off-plan investment, market appraisal and full property management.",
};

/** Build Next.js metadata from the old Yoast SEO data so search rankings carry over. */
export function seoMetadata(item: { title: string; seo: Seo; path: string }) {
  const title = item.seo.title || `${item.title} | Prestige Luxury Real Estate`;
  const description = descriptionOverrides[item.path] || item.seo.description || undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: item.path },
    openGraph: {
      title,
      description,
      url: item.path,
      images: item.seo.ogImage ? [item.seo.ogImage] : undefined,
    },
  };
}
