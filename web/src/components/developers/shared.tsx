// Building blocks for the developer directory. Pure presentation — no data imports, so these
// are safe inside the client-side search on /developers/.
import Link from "next/link";
import type { DeveloperStatus } from "@/lib/developers";

export const developerStatusLabels: Record<DeveloperStatus, string> = {
  registered: "Registered",
  "registered-portal": "Registered via Portal",
  "for-renewal": "Renewal pending",
};

const statusTone: Record<DeveloperStatus, string> = {
  registered: "border-line bg-smoke text-body",
  "registered-portal": "border-accent/25 bg-accent/10 text-accent",
  "for-renewal": "border-line bg-cream text-muted",
};

export function StatusPill({ status, className = "" }: { status: DeveloperStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] ${statusTone[status]} ${className}`}
    >
      {developerStatusLabels[status]}
    </span>
  );
}

/** Up to two initials — the only "logo" we have; no developer logos are licensed for the site. */
export function monogram(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "•"
  );
}

/** What a card needs — built on the server so the whole developers JSON stays out of the bundle. */
export type DeveloperCardData = {
  slug: string;
  name: string;
  legalName: string;
  status: DeveloperStatus;
  featured: boolean;
  tagline: string | null;
  summary: string | null;
};

/**
 * Typographic developer card: the name set in the display font on a tonal panel (black for the
 * featured developers, cream→smoke for the rest), with the monogram as a watermark.
 */
export function DeveloperCard({ developer: d, featured = false }: { developer: DeveloperCardData; featured?: boolean }) {
  return (
    <Link
      href={`/developers/${d.slug}/`}
      className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-line bg-white transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_14px_34px_rgba(0,0,0,0.09)]"
    >
      <div
        className={`relative flex items-end overflow-hidden px-5 ${
          featured
            ? "min-h-[150px] bg-gradient-to-br from-ink via-[#141010] to-[#2b2222] py-7 md:min-h-[180px] md:px-7"
            : "min-h-[112px] bg-gradient-to-br from-cream via-mist to-smoke py-5"
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute -top-3 right-1 select-none font-heading leading-none ${
            featured ? "text-[92px] text-white/[0.08] md:text-[108px]" : "text-[76px] text-ink/[0.05]"
          }`}
        >
          {monogram(d.name)}
        </span>
        <h3
          className={`relative font-heading font-normal leading-[1.15] tracking-[-0.01em] ${
            featured ? "text-[24px] text-white md:text-[29px]" : "text-[19px] text-ink transition-colors duration-300 group-hover:text-accent"
          }`}
        >
          {d.name}
        </h3>
      </div>

      <div className={`flex flex-1 flex-col px-5 pb-5 pt-4 ${featured ? "md:px-7 md:pb-6" : ""}`}>
        <StatusPill status={d.status} className="self-start" />
        {d.tagline && <p className="mt-3 text-[13.5px] font-medium leading-[1.55] text-ink">{d.tagline}</p>}
        {d.summary && <p className="mt-2 text-[13.5px] leading-[1.7] text-body">{d.summary}</p>}
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-[12px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-300 group-hover:text-accent">
          View developer
          <span aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
