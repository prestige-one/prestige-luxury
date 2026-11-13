// Category archives at their original URLs, e.g. /category/blog/, /category/real-estate/off-plan/,
// plus WordPress-style pagination: /category/blog/page/2/
import type { Metadata } from "next";
import BlogArchive, { archivePageHref } from "@/components/blog/BlogArchive";
import { activeCategories, pageCount, postsInCategory } from "@/components/blog/blog";
import { categories } from "@/lib/content";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string[] }> };

/** Split ["real-estate", "off-plan", "page", "2"] into the category path and page number. */
function resolve(slug: string[]) {
  const paged = slug.length >= 3 && slug[slug.length - 2] === "page";
  const segs = paged ? slug.slice(0, -2) : slug;
  const page = paged ? Number(slug[slug.length - 1]) : 1;
  const category = activeCategories.find((c) => c.path === `/category/${segs.join("/")}/`);
  return { category, page };
}

export const dynamicParams = false;
export function generateStaticParams() {
  return activeCategories.flatMap((c) => {
    const segs = c.path.split("/").filter(Boolean).slice(1);
    const pages = pageCount(postsInCategory(c).length);
    return [{ slug: segs }, ...Array.from({ length: pages - 1 }, (_, i) => ({ slug: [...segs, "page", String(i + 2)] }))];
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = resolve((await params).slug);
  if (!category) return {};
  const url = archivePageHref(category.path, page);
  const title = `${category.name} Archives${page > 1 ? ` - Page ${page}` : ""} | Prestige Luxury Real Estate`;
  const description = `Articles about ${category.name.toLowerCase()} from Prestige Luxury Real Estate, Dubai.`;
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

export default async function CategoryArchive({ params }: Props) {
  const { category, page } = resolve((await params).slug);
  if (!category) notFound();
  const parent = categories.find((c) => c.id === category.parent);
  const crumbs = [
    { label: "Blog", href: "/blog/" },
    ...(parent ? [{ label: parent.name, href: parent.path }] : []),
    { label: category.name },
  ];
  return <BlogArchive title={category.name} crumbs={crumbs} base={category.path} list={postsInCategory(category)} page={page} />;
}
