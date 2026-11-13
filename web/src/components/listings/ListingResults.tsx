"use client";

import { createContext, useContext, useRef, useState } from "react";
import { countLabel, parseSort, sortOptions, sortProperties, type SortKey } from "@/lib/listing-format";
import { ChevronIcon, GridIcon, ListIcon } from "./icons";

type View = "list" | "grid";
const ViewContext = createContext<{ view: View; setView: (v: View) => void }>({ view: "list", setView: () => {} });

/** Shares the list/grid choice between the toggle (in the title row) and the results column. */
export function ListingViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("list");
  return <ViewContext.Provider value={{ view, setView }}>{children}</ViewContext.Provider>;
}

export function ViewToggle() {
  const { view, setView } = useContext(ViewContext);
  const btn = (v: View, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-[2px] border transition-colors ${
        view === v ? "border-ink bg-ink text-white" : "border-line text-muted hover:text-ink"
      }`}
    >
      {icon}
    </button>
  );
  return (
    <div className="hidden gap-1.5 sm:flex">
      {btn("list", "List view", <ListIcon />)}
      {btn("grid", "Grid view", <GridIcon />)}
    </div>
  );
}

export type ResultItem = { id: string; price: number; listedAt?: string; updatedAt?: string; card: React.ReactNode };

const PAGE_SIZE = 12;

/** Count + sort select + cards (server-rendered, passed in) + pagination. */
export default function ListingResults({
  items,
  initialSort = "default",
  syncUrl = false,
}: {
  items: ResultItem[];
  initialSort?: SortKey;
  /** Search pages keep ?sort= in the address bar so the result can be shared. */
  syncUrl?: boolean;
}) {
  const { view } = useContext(ViewContext);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);

  const sorted = sortProperties(items, sort);
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const shown = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeSort(value: string) {
    const s = parseSort(value);
    setSort(s);
    setPage(1);
    if (syncUrl) {
      const url = new URL(window.location.href);
      if (s === "default") url.searchParams.delete("sort");
      else url.searchParams.set("sort", s);
      window.history.replaceState(window.history.state, "", url);
    }
  }

  function goTo(p: number) {
    setPage(p);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div ref={top} className="scroll-mt-28">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] font-medium text-ink" aria-live="polite">
          {countLabel(items.length)}
        </p>
        <label className="flex items-center gap-2 text-[14px] text-muted">
          <span>Sort by:</span>
          <select
            value={sort}
            onChange={(e) => changeSort(e.target.value)}
            className="h-[38px] rounded-[2px] border border-line bg-white px-3 text-[14px] text-ink outline-none focus:border-accent"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {items.length === 0 ? (
        <p className="border border-line bg-mist px-6 py-16 text-center text-[16px] text-muted">No listing found.</p>
      ) : (
        <div data-view={view} className="group/results grid gap-6 sm:data-[view=grid]:grid-cols-2">
          {shown.map((i) => (
            <div key={i.id}>{i.card}</div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex flex-wrap justify-center gap-1.5">
          <PageButton disabled={page === 1} onClick={() => goTo(page - 1)} label="Previous page">
            <ChevronIcon dir="left" size={16} />
          </PageButton>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <PageButton key={n} active={n === page} onClick={() => goTo(n)} label={`Page ${n}`}>
              {n}
            </PageButton>
          ))}
          <PageButton disabled={page === pages} onClick={() => goTo(page + 1)} label="Next page">
            <ChevronIcon size={16} />
          </PageButton>
        </nav>
      )}
    </div>
  );
}

function PageButton({
  children,
  onClick,
  label,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`flex h-10 min-w-10 items-center justify-center rounded-[2px] border px-3 text-[14px] transition-colors disabled:opacity-40 ${
        active ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}
