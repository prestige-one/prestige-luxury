import Link from "next/link";
import type { Post } from "@/lib/content";
import { Breadcrumb, Container } from "@/components/ui";
import BlogSidebar from "./BlogSidebar";
import PostCard from "./PostCard";
import { pageCount, pageSlice } from "./blog";

/** URL of page `n` of an archive whose first page lives at `base` (WordPress style: base/page/n/). */
export const archivePageHref = (base: string, n: number) => (n <= 1 ? base : `${base}page/${n}/`);

function Pagination({ base, page, total }: { base: string; page: number; total: number }) {
  if (total <= 1) return null;
  const item = "flex h-10 min-w-10 items-center justify-center border px-3 text-[14px] transition-colors";
  return (
    <nav aria-label="Pagination" className="mt-12">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 && (
          <li>
            <Link href={archivePageHref(base, page - 1)} className={`${item} border-line hover:border-ink`} aria-label="Previous page">
              ‹
            </Link>
          </li>
        )}
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page" className={`${item} border-ink bg-ink text-white`}>
                {n}
              </span>
            ) : (
              <Link href={archivePageHref(base, n)} className={`${item} border-line text-body hover:border-ink`}>
                {n}
              </Link>
            )}
          </li>
        ))}
        {page < total && (
          <li>
            <Link href={archivePageHref(base, page + 1)} className={`${item} border-line hover:border-ink`} aria-label="Next page">
              ›
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

/** Blog index, category and tag archives: title bar + 2-column card grid + sidebar + pagination. */
export default function BlogArchive({
  title,
  intro,
  crumbs,
  base,
  list,
  page,
}: {
  title: string;
  intro?: string;
  crumbs: { label: string; href?: string }[];
  base: string;
  list: Post[];
  page: number;
}) {
  const total = pageCount(list.length);
  const items = pageSlice(list, page);
  return (
    <>
      <section className="border-b border-line bg-mist py-10">
        <Container>
          <Breadcrumb items={page > 1 ? [...crumbs.slice(0, -1), { ...crumbs[crumbs.length - 1], href: base }, { label: `Page ${page}` }] : crumbs} />
          <h1 className="mt-3 text-[30px] font-medium text-ink md:text-[36px]">
            {title}
            {page > 1 && <span className="ml-2 text-[18px] font-normal text-muted">— Page {page}</span>}
          </h1>
          {intro && <p className="mt-2 max-w-[720px] text-[15px] text-muted">{intro}</p>}
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {items.length ? (
              <div className="grid gap-8 sm:grid-cols-2">
                {items.map((p, i) => (
                  <PostCard key={p.id} post={p} priority={i < 2} />
                ))}
              </div>
            ) : (
              <p className="text-muted">No posts found.</p>
            )}
            <Pagination base={base} page={page} total={total} />
          </div>
          <BlogSidebar currentPath={base} />
        </div>
      </Container>
    </>
  );
}
