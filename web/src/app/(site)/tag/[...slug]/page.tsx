// Tag archives: /tag/<slug>/ and /tag/<slug>/page/<n>/ (only tags used by at least one post)
import type { Metadata } from "next";
import BlogArchive, { archivePageHref } from "@/components/blog/BlogArchive";
import { activeTags, pageCount, postsWithTag, tagPath } from "@/components/blog/blog";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string[] }> };

function resolve(slug: string[]) {
  const paged = slug.length === 3 && slug[1] === "page";
  if (slug.length !== 1 && !paged) return { tag: undefined, page: 1 };
  return { tag: activeTags.find((t) => t.slug === slug[0]), page: paged ? Number(slug[2]) : 1 };
}

export const dynamicParams = false;
export function generateStaticParams() {
  return activeTags.flatMap((t) => {
    const pages = pageCount(postsWithTag(t).length);
    return [{ slug: [t.slug] }, ...Array.from({ length: pages - 1 }, (_, i) => ({ slug: [t.slug, "page", String(i + 2)] }))];
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag, page } = resolve((await params).slug);
  if (!tag) return {};
  const url = archivePageHref(tagPath(tag), page);
  const title = `${tag.name} Archives${page > 1 ? ` - Page ${page}` : ""} | Prestige Luxury Real Estate`;
  const description = `Articles tagged “${tag.name}” from Prestige Luxury Real Estate, Dubai.`;
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

export default async function TagArchive({ params }: Props) {
  const { tag, page } = resolve((await params).slug);
  if (!tag) notFound();
  return (
    <BlogArchive
      title={`Tag: ${tag.name}`}
      crumbs={[{ label: "Blog", href: "/blog/" }, { label: tag.name }]}
      base={tagPath(tag)}
      list={postsWithTag(tag)}
      page={page}
    />
  );
}
