import type { Metadata } from "next";
import BlogArchive from "@/components/blog/BlogArchive";
import { getPage, posts, seoMetadata } from "@/lib/content";

const blogPage = getPage("/blog/")!;
export const metadata: Metadata = seoMetadata(blogPage);

export default function BlogIndex() {
  return <BlogArchive title="Blog" base="/blog/" list={posts} page={1} />;
}
