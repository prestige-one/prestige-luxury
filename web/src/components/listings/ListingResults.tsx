"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { sortOptions, type SortKey } from "@/lib/listing-format";
import { GridIcon, ListIcon } from "./icons";

type View = "list" | "grid";

// Sorting and paging are links now, so the list/grid choice has to survive a navigation.
// It lives outside React, in localStorage, and is read through useSyncExternalStore so the
// toggle and the results column always agree.
const STORAGE_KEY = "pl-listing-view";
const listeners = new Set<() => void>();
let current: View | null = null;

function readView(): View {
  if (current === null) {
    try {
      current = localStorage.getItem(STORAGE_KEY) === "list" ? "list" : "grid";
    } catch {
      current = "grid";
    }
  }
  return current;
}

function writeView(v: View) {
  current = v;
  try {
    localStorage.setItem(STORAGE_KEY, v);
  } catch {
    // ignore
  }
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

const useView = () => useSyncExternalStore(subscribe, readView, () => "grid" as View);

export function ViewToggle() {
  const view = useView();
  const btn = (v: View, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => writeView(v)}
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

/** Holds the current page's cards (server-rendered, passed as children) and applies the layout. */
export function ResultsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div data-view={useView()} className="pl-listing-results group/results grid gap-6 sm:data-[view=grid]:grid-cols-2 lg:data-[view=grid]:grid-cols-3">
      {children}
    </div>
  );
}

/**
 * Sort select. The server owns the order, so choosing one just rewrites `?sort=` — the result
 * can be shared, bookmarked and reached with the back button.
 */
export function SortSelect({ sort, hrefs }: { sort: SortKey; hrefs: Record<SortKey, string> }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-[14px] text-muted">
      <span>Sort by:</span>
      <select
        value={sort}
        onChange={(e) => router.replace(hrefs[e.target.value as SortKey], { scroll: false })}
        className="h-[38px] rounded-[2px] border border-line bg-white px-3 text-[14px] text-ink outline-none focus:border-accent"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
