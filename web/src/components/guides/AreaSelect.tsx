"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** "Select Neighbourhood… / Go!" dropdown from the original Dubai Neighbourhoods page. */
export default function AreaSelect({ areas }: { areas: { name: string; href: string }[] }) {
  const router = useRouter();
  const [href, setHref] = useState("");
  return (
    <form
      className="mx-auto flex w-full max-w-[640px] flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (href) router.push(href);
      }}
    >
      <label htmlFor="pl-area-select" className="sr-only">
        Select Neighbourhood
      </label>
      <select
        id="pl-area-select"
        value={href}
        onChange={(e) => setHref(e.target.value)}
        className="h-12 flex-1 rounded-[2px] border border-line bg-white px-4 text-[14px] text-body focus:border-ink focus:outline-none"
      >
        <option value="">Select Neighbourhood…</option>
        {[...areas]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((a) => (
            <option key={a.href} value={a.href}>
              {a.name}
            </option>
          ))}
      </select>
      <button type="submit" className="h-12 rounded-[2px] bg-black px-8 text-[14px] font-medium text-white transition-colors hover:bg-accent">
        Go!
      </button>
    </form>
  );
}
