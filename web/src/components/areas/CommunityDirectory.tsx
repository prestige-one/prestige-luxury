"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import DirectoryCard from "@/components/DirectoryCard";

export type CommunityCardData = { slug: string; name: string; lifestyle: string; image: string; description: string };

export default function CommunityDirectory({ communities }: { communities: CommunityCardData[] }) {
  const prefix = `pl-community-${useId()}`;
  const [query, setQuery] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const lifestyles = useMemo(() => [...new Set(communities.map((community) => community.lifestyle))].sort(), [communities]);
  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return communities.filter((community) => (!term || community.name.toLocaleLowerCase().includes(term)) && (!lifestyle || community.lifestyle === lifestyle));
  }, [communities, lifestyle, query]);
  const reset = () => { setQuery(""); setLifestyle(""); };

  return <div className="pl-community-directory">
    <div className="mx-auto mb-10 max-w-[940px] md:mb-14">
      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr] sm:gap-6">
        <div className="relative">
          <label htmlFor={`${prefix}-search`} className="sr-only">Search communities</label>
          <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5" /></svg>
          <input id={`${prefix}-search`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search communities…" autoComplete="off" className="h-[52px] w-full rounded-[4px] border border-line bg-white pl-12 pr-4 text-[14px] text-ink outline-none focus:border-black" />
        </div>
        <div>
          <label htmlFor={`${prefix}-lifestyle`} className="sr-only">Community lifestyle</label>
          <select id={`${prefix}-lifestyle`} value={lifestyle} onChange={(e) => setLifestyle(e.target.value)} className="h-[52px] w-full cursor-pointer rounded-[4px] border border-line bg-white px-4 text-[14px] text-ink outline-none focus:border-black">
            <option value="">All communities</option>
            {lifestyles.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4 flex min-h-6 items-center justify-between gap-4 text-[12px] text-muted">
        <p role="status" aria-live="polite">{matches.length} {matches.length === 1 ? "community" : "communities"}{query || lifestyle ? " matching your search" : " to explore"}</p>
        {(query || lifestyle) && <button type="button" onClick={reset} className="cursor-pointer underline underline-offset-4 hover:text-ink">Clear filters</button>}
      </div>
    </div>
    {matches.length ? <div className="pl-community-grid grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-9">
      {matches.map((community) => <DirectoryCard key={community.slug} className="pl-community-card" href={`/area/${community.slug}/`} title={community.name} description={community.description} image={community.image} imageAlt={community.name === "Business Bay" ? "Residential buildings in Business Bay, Dubai" : community.name} />)}
    </div> : <div className="rounded-[6px] bg-mist px-6 py-14 text-center">
      <h2 className="text-[20px] font-medium text-ink">No communities match your search</h2>
      <p className="mt-3 text-[14px] text-muted">Try another community name or clear your filters.</p>
      <button type="button" onClick={reset} className="mt-6 min-h-11 cursor-pointer bg-black px-7 text-[14px] text-white transition-opacity hover:opacity-70">Show all communities</button>
    </div>}
    <p className="mt-14 text-center text-[14px] leading-[1.8] text-muted">Looking for a different neighbourhood? <Link href="/contact-us/" className="text-ink underline underline-offset-4 hover:opacity-65">Speak to a property specialist</Link>.</p>
  </div>;
}
