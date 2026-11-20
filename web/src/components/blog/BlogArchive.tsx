import Link from "next/link";
import type { Post } from "@/lib/content";
import { Container } from "@/components/ui";
import CategoryLinks from "./CategoryLinks";
import PostCard from "./PostCard";
import { activeCategories, pageCount, pageSlice } from "./blog";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

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

/** Blog and category archives share cards, navigation and pagination. */
export default function BlogArchive({
  title,
  intro,
  base,
  list,
  page,
}: {
  title: string;
  intro?: string;
  base: string;
  list: Post[];
  page: number;
}) {
  const total = pageCount(list.length);
  const items = pageSlice(list, page);
  return (
    <>
      <BreadcrumbStructuredData items={[...(base !== "/blog/" ? [{ name: "Blog", path: "/blog/" }] : []), { name: title, path: base }, ...(page > 1 ? [{ name: `Page ${page}`, path: archivePageHref(base, page) }] : [])]} />
      <section className="pl-blog-archive bg-black py-12 text-white md:py-16">
        <Container>
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">The Prestige Journal</p>
          <h1 className="mt-3 text-[30px] font-medium text-white md:text-[36px]">
            {title}
            {page > 1 && <span className="ml-2 text-[18px] font-normal text-white/70">— Page {page}</span>}
          </h1>
          <p className="mt-3 max-w-[720px] text-[15px] leading-relaxed text-white/80">{intro || 'Market perspectives, neighbourhood guides and stories from Dubai, curated by Prestige Luxury Real Estate.'}</p>
          <p className="mt-4 text-[13px] text-white/70">{list.length} {list.length === 1 ? 'article' : 'articles'}</p>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <div className="mb-9">
          <CategoryLinks categories={activeCategories} all activePath={base} />
        </div>
            {items.length ? (
              <div className="pl-blog-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <PostCard key={p.id} post={p} priority={i < 3} />
                ))}
              </div>
            ) : (
              <p className="text-muted">No posts found.</p>
            )}
            <Pagination base={base} page={page} total={total} />
      </Container>
    </>
  );
}
