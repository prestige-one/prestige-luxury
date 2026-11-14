// /blog/page/2/, /blog/page/3/ ... (WordPress-style pagination of the blog index)
import type { Metadata } from "next";
import BlogArchive from "@/components/blog/BlogArchive";
import { pageCount } from "@/components/blog/blog";
import { getPage, posts, seoMetadata } from "@/lib/content";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ n: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: pageCount(posts.length) - 1 }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const meta = seoMetadata(getPage("/blog/")!);
  const title = `Blog - Page ${n} | Prestige Luxury Real Estate`;
  return { ...meta, title: { absolute: title }, alternates: { canonical: `/blog/page/${n}/` }, openGraph: { ...meta.openGraph, title, url: `/blog/page/${n}/` } };
}

export default async function BlogPaged({ params }: Props) {
  const { n } = await params;
  if (!/^\d+$/.test(n) || Number(n) < 2 || Number(n) > pageCount(posts.length)) notFound();
  return <BlogArchive title="Blog" base="/blog/" list={posts} page={Number(n)} />;
}
