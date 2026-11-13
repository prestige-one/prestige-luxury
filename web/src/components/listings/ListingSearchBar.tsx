"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { budgetOptions } from "@/lib/listing-format";

export type SearchBarValues = {
  q?: string;
  city?: string;
  location?: string;
  status?: string;
  type?: string;
  beds?: string;
  maxPrice?: string;
};

const statusOptions = [
  { value: "for-rent", label: "For Rent" },
  { value: "for-sale", label: "For Sale" },
  { value: "off-plan", label: "Off-Plan" },
];
const fmt = (n: number) => `AED ${new Intl.NumberFormat("en-AE").format(n)}`;

/** Houzez half-map/archive search row: keyword, city, area, "Advanced" panel, Search. Sends to /search-results/. */
export default function ListingSearchBar({
  cities,
  areas,
  types,
  initial = {},
}: {
  cities: string[];
  areas: string[];
  types: string[];
  initial?: SearchBarValues;
}) {
  const router = useRouter();
  const [advanced, setAdvanced] = useState(Boolean(initial.status || initial.type || initial.beds || initial.maxPrice));
  // Buying and renting are quoted on different scales, so the budget ladder follows the status.
  const [status, setStatus] = useState(initial.status ?? "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? "");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget).entries()) {
      if (typeof v === "string" && v.trim()) q.set(k, v.trim());
    }
    router.push(`/search-results/${q.size ? `?${q}` : ""}`);
  }

  const field = "h-[42px] w-full rounded-[2px] border border-line bg-white px-3 text-[14px] text-ink outline-none focus:border-accent";

  return (
    <form onSubmit={submit} action="/search-results/" method="get" className="border-b border-line bg-white py-4" role="search">
      <div className="mx-auto w-full max-w-[1140px] px-5">
        <div className="grid gap-2.5 md:grid-cols-[2.6fr_1fr_1fr_auto_auto]">
          <label>
            <span className="sr-only">Keyword</span>
            <input
              name="q"
              defaultValue={initial.q}
              placeholder="Enter an address, town, street, zip or property ID"
              className={field}
            />
          </label>
          <label>
            <span className="sr-only">City</span>
            <select name="city" defaultValue={initial.city ?? ""} className={field}>
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Area</span>
            <select name="location" defaultValue={initial.location ?? ""} className={field}>
              <option value="">All Areas</option>
              {areas.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setAdvanced((a) => !a)}
            aria-expanded={advanced}
            aria-controls="advanced-search"
            className="h-[42px] rounded-[2px] bg-black px-6 text-[14px] font-medium text-white transition-colors hover:bg-accent"
          >
            Advanced
          </button>
          <button
            type="submit"
            className="h-[42px] rounded-[2px] border border-ink px-7 text-[14px] font-medium text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Search
          </button>
        </div>

        <div id="advanced-search" hidden={!advanced} className="mt-2.5 grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
          <label>
            <span className="sr-only">Status</span>
            <select
              name="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setMaxPrice("");
              }}
              className={field}
            >
              <option value="">All Status</option>
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Property type</span>
            <select name="type" defaultValue={initial.type ?? ""} className={field}>
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Bedrooms</span>
            <select name="beds" defaultValue={initial.beds ?? ""} className={field}>
              <option value="">Bedrooms</option>
              <option value="0">Studio</option>
              {[1, 2, 3, 4].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="5">5+</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Maximum price</span>
            <select name="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={field}>
              <option value="">{status === "for-rent" ? "Max. Rent / year" : "Max. Price"}</option>
              {budgetOptions(status).map((p) => (
                <option key={p} value={p}>
                  {`${fmt(p)}${status === "for-rent" ? " / year" : ""}`}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </form>
  );
}
