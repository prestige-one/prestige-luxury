import Link from "next/link";
import { pageWindow } from "@/lib/listing-format";
import { ChevronIcon } from "./icons";

const cell =
  "flex h-9 min-w-9 items-center justify-center rounded-[2px] border px-2 text-[13px] transition-colors sm:h-10 sm:min-w-10 sm:px-3 sm:text-[14px]";

/**
 * Archive pagination. Every page is a real link to `?page=N`, so page 2 can be shared,
 * bookmarked and reached with the back button. Only the first, last and current pages (plus
 * their neighbours) are listed — « ‹ 1 … 7 8 9 … 15 › » — so the row still fits at 375px.
 */
export default function Pagination({ page, pages, href }: { page: number; pages: number; href: (page: number) => string }) {
  if (pages <= 1) return null;

  const step = (to: number, label: string, children: React.ReactNode, hiddenOnMobile = false) => {
    const outside = to < 1 || to > pages;
    const classes = `${cell} ${hiddenOnMobile ? "hidden sm:flex" : ""} ${
      outside ? "pointer-events-none border-line text-muted opacity-40" : "border-line text-ink hover:border-ink"
    }`;
    return outside ? (
      <span aria-hidden className={classes}>
        {children}
      </span>
    ) : (
      <Link href={href(to)} aria-label={label} className={classes}>
        {children}
      </Link>
    );
  };

  return (
    <nav aria-label="Pagination" className="mt-10 flex justify-center gap-1 sm:gap-1.5">
      {step(1, "First page", "«", true)}
      {step(page - 1, "Previous page", <ChevronIcon dir="left" size={16} />)}
      {pageWindow(page, pages).map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} aria-hidden className="flex h-9 min-w-4 items-end justify-center text-[13px] text-muted sm:h-10">
            …
          </span>
        ) : n === page ? (
          <span key={n} aria-current="page" className={`${cell} border-ink bg-ink text-white`}>
            {n}
          </span>
        ) : (
          <Link key={n} href={href(n)} aria-label={`Page ${n}`} className={`${cell} border-line text-ink hover:border-ink`}>
            {n}
          </Link>
        ),
      )}
      {step(page + 1, "Next page", <ChevronIcon size={16} />)}
      {step(pages, "Last page", "»", true)}
    </nav>
  );
}
