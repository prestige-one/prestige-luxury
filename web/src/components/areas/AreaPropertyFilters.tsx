"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Link from "next/link";
import { budgetOptions, type StatusSlug } from "@/lib/listing-format";
import type { SearchBarValues } from "@/components/listings/ListingSearchBar";

/** Area-scoped search above the property results. */
export default function AreaPropertyFilters({ path, name, status, initial, types }: {
  path: string;
  name: string;
  status: StatusSlug;
  initial: SearchBarValues;
  types: string[];
}) {
  const router = useRouter();
  const anchor = status === "off-plan" ? "pl-area-projects" : "pl-area-properties";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === "string" && value.trim()) query.set(key, value.trim());
    }
    router.push(`${path}?${query}#${anchor}`);
  }
  const field = "h-12 w-full min-w-0 cursor-pointer rounded-[3px] border border-line bg-white px-3 text-[13px] text-ink outline-none focus:border-black focus:ring-1 focus:ring-black";
  return <form action={`${path}#${anchor}`} onSubmit={submit} role="search" aria-label={`Property search in ${name}`} className="pl-area-filters mb-7 rounded-[6px] border border-line bg-mist p-4">
    <input type="hidden" name="status" value={status} />
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-[1.5fr_1fr_0.85fr_1.1fr_auto]">
      <label className="col-span-2 lg:col-span-1"><span className="sr-only">Property keyword</span><input type="search" name="q" defaultValue={initial.q ?? ""} placeholder="Property name or keyword" className={`${field} cursor-text`} /></label>
      <label><span className="sr-only">Property type</span><select name="type" defaultValue={initial.type ?? ""} className={field}><option value="">All property types</option>{[...new Set([...types, ...(initial.type ? [initial.type] : [])])].map((type) => <option key={type}>{type}</option>)}</select></label>
      <label><span className="sr-only">Bedrooms</span><select name="beds" defaultValue={initial.beds ?? ""} className={field}><option value="">All bedrooms</option><option value="0">Studio</option>{[1, 2, 3, 4].map((beds) => <option key={beds} value={beds}>{beds} {beds === 1 ? "bedroom" : "bedrooms"}</option>)}<option value="5">5+ bedrooms</option></select></label>
      <label className="col-span-2 sm:col-span-1"><span className="sr-only">Maximum price</span><select name="maxPrice" defaultValue={initial.maxPrice ?? ""} className={field}><option value="">{status === "for-rent" ? "Max. rent / year" : "Maximum price"}</option>{budgetOptions(status).map((price) => <option key={price} value={price}>AED {new Intl.NumberFormat("en-AE").format(price)}{status === "for-rent" ? " / year" : ""}</option>)}</select></label>
      <button type="submit" className="col-span-2 h-12 cursor-pointer rounded-[3px] bg-black px-7 text-[14px] font-medium text-white transition-opacity hover:opacity-75 sm:col-span-1">Search</button>
    </div>
    {(initial.q || initial.type || initial.beds || initial.maxPrice) && <Link href={`${path}?status=${status}#${anchor}`} className="mt-3 inline-block text-[12px] text-muted underline underline-offset-4 hover:text-ink">Clear filters</Link>}
  </form>;
}
