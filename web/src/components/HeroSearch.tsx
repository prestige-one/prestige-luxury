"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const tabs = [
  { label: "All", value: "" },
  { label: "For Rent", value: "for-rent" },
  { label: "For Sale", value: "for-sale" },
  { label: "Off-Plan", value: "off-plan" },
] as const;

const prices = [500000, 1000000, 2000000, 3000000, 5000000, 10000000, 20000000, 50000000];
const rentPrices = [50000, 100000, 150000, 200000, 300000, 500000, 1000000];
const fmt = (n: number) => `AED ${new Intl.NumberFormat("en-AE").format(n)}`;

/** Houzez "search builder" on the homepage hero. Sends the visitor to /search-results/ with filters. */
export default function HeroSearch({ locations, types }: { locations: string[]; types: string[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [beds, setBeds] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    if (location) q.set("location", location);
    if (type) q.set("type", type);
    if (beds) q.set("beds", beds);
    if (maxPrice) q.set("maxPrice", maxPrice);
    router.push(`/search-results/${q.size ? `?${q}` : ""}`);
  }

  const select =
    "h-[44px] w-full appearance-none truncate rounded-[2px] border-0 bg-white px-3 pr-8 text-[14px] text-ink outline-none transition-shadow duration-200 focus:ring-2 focus:ring-accent md:h-[40px]";

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-[1130px]">
      <div className="no-scrollbar flex justify-start gap-[3px] overflow-x-auto sm:justify-center" role="group" aria-label="Property status">
        {tabs.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setStatus(t.value)}
            aria-pressed={status === t.value}
            className={`h-[42px] min-w-[62px] shrink-0 grow px-4 text-[13px] font-medium transition-colors duration-300 sm:grow-0 sm:text-[14px] ${
              status === t.value ? "bg-black text-white" : "bg-white/60 text-ink hover:bg-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-[10px] gap-y-3 bg-black/40 px-4 pb-5 pt-4 backdrop-blur-[2px] sm:px-6 sm:pb-7 md:grid-cols-[2.9fr_1.9fr_1.4fr_1.4fr_1.9fr] md:gap-y-[10px] md:bg-black/35 md:px-[35px] md:pb-[38px] md:pt-[24px]">
        <Field label="Search" className="col-span-2 md:col-span-1">
          <select className={select} value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location">
            <option value="">Select the locations</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>
        <Field label="Looking for" className="col-span-2 md:col-span-1">
          <select className={select} value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type">
            <option value="">Property Type</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Property size">
          <select className={select} value={beds} onChange={(e) => setBeds(e.target.value)} aria-label="Bedrooms">
            <option value="">Bedrooms</option>
            <option value="0">Studio</option>
            {[1, 2, 3, 4].map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="5">5+</option>
          </select>
        </Field>
        <Field label="Your budget">
          <select className={select} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} aria-label="Maximum price">
            <option value="">Max. Price</option>
            {(status === "for-rent" ? rentPrices : prices).map((p) => (
              <option key={p} value={p}>
                {fmt(p)}
              </option>
            ))}
          </select>
        </Field>
        <div className="col-span-2 flex items-end md:col-span-1">
          <button
            type="submit"
            className="h-[46px] w-full rounded-[2px] bg-white text-[14px] font-medium tracking-[0.02em] text-ink transition-colors duration-300 hover:bg-accent hover:text-white active:translate-y-px md:h-[40px]"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`relative block min-w-0 text-left ${className}`}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-white">{label}</span>
      {children}
      <svg className="pointer-events-none absolute bottom-[15px] right-3 md:bottom-[13px]" width="12" height="14" viewBox="0 0 12 16" fill="none" stroke="#222" strokeWidth="1.5" aria-hidden>
        <path d="m3 6 3-3 3 3M3 10l3 3 3-3" />
      </svg>
    </label>
  );
}
