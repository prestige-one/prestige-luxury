"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { budgetOptions } from "@/lib/listing-format";
import LocationAutocomplete from "./LocationAutocomplete";

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

/** Location search retaining the current archive's sale/rent/off-plan scope. */
export default function ListingSearchBar({
  cities,
  areas,
  locations,
  types,
  initial = {},
}: {
  cities: string[];
  areas: string[];
  locations: string[];
  types: string[];
  initial?: SearchBarValues;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const [advanced, setAdvanced] = useState(false);
  const advancedId = `pl-listing-advanced-${useId()}`;
  // Buying and renting are quoted on different scales, so the budget ladder follows the status.
  // The current archive wins over any stale filter values from a previous page.
  const pageStatus = statusOptions.find(({ value }) => pathname === `/status/${value}/` || pathname === `/status/${value}`)?.value;
  const fixedStatus = pageStatus ?? statusOptions.find((option) => option.value === initial.status)?.value;
  const [selectedStatus, setStatus] = useState(initial.status ?? "");
  const status = fixedStatus ?? selectedStatus;
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? "");

  function search(form: HTMLFormElement, location?: string) {
    const q = new URLSearchParams();
    for (const [k, v] of new FormData(form).entries()) {
      if (typeof v === "string" && v.trim()) q.set(k, v.trim());
    }
    // Selection runs before React commits the input's updated value.
    if (location !== undefined) q.set("q", location);
    if (fixedStatus) q.set("status", fixedStatus);
    router.push(`/search-results/${q.size ? `?${q}` : ""}`);
  }

  const field = "h-[42px] w-full rounded-[2px] border border-line bg-white px-3 text-[14px] text-ink outline-none focus:border-accent";

  return (
    <form ref={formRef} onSubmit={(event) => { event.preventDefault(); search(event.currentTarget); }} action="/search-results/" method="get" className="border-b border-line bg-white py-4" role="search">
      {fixedStatus && <input type="hidden" name="status" value={fixedStatus} />}
      <div className="mx-auto w-full max-w-[1140px] px-5">
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[2.6fr_1fr_1fr_auto_auto]">
          <LocationAutocomplete options={locations} initial={initial.q} className={field}
            onSelect={(location) => { if (formRef.current) search(formRef.current, location); }} />
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
            aria-controls={advancedId}
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

        <div id={advancedId} hidden={!advanced} className={`pl-listing-advanced mt-2.5 gap-2.5 sm:grid-cols-2 md:grid-cols-4 ${advanced ? "grid" : "hidden"}`}>
          <label>
            <span className="sr-only">Status</span>
            <select
              name={fixedStatus ? undefined : "status"}
              disabled={!!fixedStatus}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setMaxPrice("");
              }}
              className={`${field} disabled:cursor-default disabled:text-ink disabled:opacity-100`}
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
              {initial.type && !types.includes(initial.type) && <option value={initial.type}>{initial.type}</option>}
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
