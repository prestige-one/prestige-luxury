"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";

// Per-visitor "Recently Viewed Properties" list, kept in localStorage (a convenience only).
const KEY = "pl-recently-viewed";
const MAX = 5;

export type ViewedItem = { slug: string; title: string; price: string; image?: string };

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): ViewedItem[] {
  try {
    const v = JSON.parse(raw ?? "[]");
    return Array.isArray(v) ? v.filter((i) => i && typeof i.slug === "string" && typeof i.title === "string") : [];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Put on the property page: remembers the listing for the sidebar widget. */
export function TrackView({ item }: { item: ViewedItem }) {
  useEffect(() => {
    try {
      const list = [item, ...parse(read()).filter((i) => i.slug !== item.slug)].slice(0, MAX);
      window.localStorage.setItem(KEY, JSON.stringify(list));
      listeners.forEach((l) => l());
    } catch {
      // storage unavailable (private mode etc.) — nothing to remember
    }
  }, [item]);
  return null;
}

/** Sidebar widget. `slugs` = listings that still exist, so removed listings are not linked. */
export default function RecentlyViewed({ slugs, exclude }: { slugs: string[]; exclude?: string }) {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const items = useMemo(() => {
    const valid = new Set(slugs);
    return parse(raw)
      .filter((i) => valid.has(i.slug) && i.slug !== exclude)
      .slice(0, 3);
  }, [raw, slugs, exclude]);

  if (!items.length) return <p className="text-[13px] text-muted">No recently viewed properties.</p>;

  return (
    <ul className="space-y-4">
      {items.map((i) => (
        <li key={i.slug}>
          <Link href={`/property/${i.slug}/`} className="group flex gap-3">
            <span className="relative h-[60px] w-[80px] shrink-0 overflow-hidden bg-smoke">
              {i.image && (
                // eslint-disable-next-line @next/next/no-img-element -- tiny thumbnail from stored data
                <img src={i.image} alt="" loading="lazy" className="h-full w-full object-cover" />
              )}
            </span>
            <span className="min-w-0">
              <span className="line-clamp-2 text-[13px] font-medium leading-snug text-ink group-hover:text-accent">{i.title}</span>
              <span className="mt-1 block text-[13px] text-muted">{i.price}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
