// /blog/page/2/, /blog/page/3/ ... (WordPress-style pagination of the blog index)
import type { Metadata } from "next";
import BlogArchive from "@/components/blog/BlogArchive";
import { pageCount } from "@/components/blog/blog";
import { posts } from "@/lib/content";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ n: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: pageCount(posts.length) - 1 }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return pageMetadata({ title: `Dubai Real Estate Insights – Page ${n} | Prestige Luxury`,
    description: `Browse page ${n} of Dubai real estate news, neighbourhood guides and property insights from Prestige Luxury. Explore more articles for buyers, tenants and investors.`, path: `/blog/page/${n}/` });
}

export default async function BlogPaged({ params }: Props) {
  const { n } = await params;
  if (!/^\d+$/.test(n) || Number(n) < 2 || Number(n) > pageCount(posts.length)) notFound();
  return <BlogArchive title="Blog" base="/blog/" list={posts} page={Number(n)} />;
}
