"use client";

import { useId, useMemo, useState } from "react";
import { DeveloperCard, type DeveloperCardData } from "./shared";

/**
 * /developers/ — the whole list, filtered as you type on the developer's trading name or the
 * name it is registered under. Everything is rendered up-front (37 cards), so filtering is a
 * client-side array filter; no request, no loading state.
 */
export default function DeveloperDirectory({ developers }: { developers: DeveloperCardData[] }) {
  const inputId = `pl-developer-search-${useId()}`;
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const matches = useMemo(
    () => (q ? developers.filter((d) => `${d.name} ${d.legalName}`.toLowerCase().includes(q)) : developers),
    [developers, q],
  );
  const featured = matches.filter((d) => d.featured);
  const rest = matches.filter((d) => !d.featured);

  return (
    <div>
      <div className="mx-auto max-w-[520px]">
        <label htmlFor={inputId} className="sr-only">
          Search developers
        </label>
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search developers…"
            autoComplete="off"
            className="h-12 w-full rounded-[2px] border border-line bg-white pl-11 pr-4 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#8a8a8a] hover:border-[#cfcfcf] focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,0,0,0.14)]"
          />
        </div>
        <p aria-live="polite" className="mt-3 text-center text-[13px] text-muted">
          {matches.length} {matches.length === 1 ? "developer" : "developers"}
          {q && " matching your search"}
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="mt-10 rounded-[2px] border border-line bg-mist px-6 py-16 text-center">
          <p className="text-[16px] text-ink">No developer matches “{query.trim()}”.</p>
          <p className="mt-2 text-[14px] text-muted">Try a shorter search, or clear the box to see all developers.</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-[2px] bg-black px-7 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-accent"
          >
            Show all developers
          </button>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <section className="mt-10 md:mt-12">
              <h2 className="mb-6 font-heading text-[20px] font-normal text-ink md:text-[24px]">Featured Developers</h2>
              <div className="pl-developer-grid grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-9">
                {featured.map((d) => (
                  <DeveloperCard key={d.slug} developer={d} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="mt-12 md:mt-16">
              <h2 className="mb-6 font-heading text-[20px] font-normal text-ink md:text-[24px]">
                {featured.length > 0 ? "All Developers" : "Developers"}
              </h2>
              <div className="pl-developer-grid grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-9">
                {rest.map((d) => (
                  <DeveloperCard key={d.slug} developer={d} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
