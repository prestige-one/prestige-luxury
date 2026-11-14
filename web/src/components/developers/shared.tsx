// Building blocks for the developer directory. Pure presentation — no data imports, so these
// are safe inside the client-side search on /developers/.
import DirectoryCard from "@/components/DirectoryCard";
import Media from "@/components/Media";
import type { DeveloperStatus } from "@/lib/developers";

export const developerStatusLabels: Record<DeveloperStatus, string> = {
  registered: "Registered",
  "registered-portal": "Registered via Portal",
  "for-renewal": "Renewal pending",
};

const statusTone: Record<DeveloperStatus, string> = {
  registered: "border-black bg-black text-white",
  "registered-portal": "border-black bg-black text-white",
  "for-renewal": "border-line bg-cream text-muted",
};

export function StatusPill({ status, className = "", ribbon = false, light = false }: { status: DeveloperStatus; className?: string; ribbon?: boolean; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] ${ribbon ? "pl-developer-ribbon pl-5 pr-3" : "rounded-full px-3"} ${light ? "border-white bg-white text-black" : statusTone[status]} ${className}`}
    >
      {status !== "for-renewal" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m5 12 4 4 10-10" /></svg>}
      {developerStatusLabels[status]}
    </span>
  );
}

/** Fallback initials when no local brand logo is available. */
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
  featured: boolean;
  summary: string | null;
  logo: string | null;
  logoClassName?: string;
  image: string;
  imageAlt: string;
};

/**
 * Editorial directory card: a photograph, inset brand tile and compact summary.
 */
export function DeveloperCard({ developer: d }: { developer: DeveloperCardData }) {
  return (
    <DirectoryCard href={`/developers/${d.slug}/`} title={d.name} description={d.summary} image={d.image} imageAlt={d.imageAlt}
      className="pl-developer-card" imageClassName="pl-developer-card-heading" showArrow branding={
      <div className="pl-developer-brand absolute bottom-4 left-4 flex h-[68px] w-[158px] max-w-[calc(100%-32px)] items-center justify-center rounded-[4px] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        {d.logo ? (
          <Media src={d.logo} alt={`${d.name} logo`} width={150} height={46} unoptimized className={`h-full w-full object-contain ${d.logoClassName || ""}`} />
        ) : <span className="line-clamp-3 text-center text-[13px] font-medium leading-[1.3] text-ink">{d.name}</span>}
      </div>
    } />
  );
}
