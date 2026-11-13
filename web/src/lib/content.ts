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

/** Build Next.js metadata from the old Yoast SEO data so search rankings carry over. */
export function seoMetadata(item: { title: string; seo: Seo; path: string }) {
  const title = item.seo.title || `${item.title} | Prestige Luxury Real Estate`;
  return {
    title: { absolute: title },
    description: item.seo.description || undefined,
    alternates: { canonical: item.path },
    openGraph: {
      title,
      description: item.seo.description || undefined,
      url: item.path,
      images: item.seo.ogImage ? [item.seo.ogImage] : undefined,
    },
  };
}
