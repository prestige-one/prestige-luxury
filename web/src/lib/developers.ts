// The developer directory (/developers/).
// content/developers.json is maintained separately — the research fields (tagline, founded,
// headquarters, founder, website, description, specialities, projects, communities) are filled
// in over time, so every consumer has to render fine while they are still empty/null.
// Server-side only: this imports the developers and the listings JSON.
import developersJson from "../../content/developers.json";
import { properties, slugify, type Property } from "./properties";

export type DeveloperStatus = "registered" | "registered-portal" | "for-renewal";

export type DeveloperProject = { name: string; community: string | null };

export type Developer = {
  slug: string;
  name: string;
  /** Name on the RERA/DLD register, e.g. "DUBAI HOLDING - NAKHEEL". */
  legalName: string;
  status: DeveloperStatus;
  featured: boolean;
  tagline: string | null;
  founded: number | null;
  headquarters: string | null;
  founder: string | null;
  website: string | null;
  /** About copy, one entry per paragraph. */
  description: string[];
  specialities: string[];
  projects: DeveloperProject[];
  communities: string[];
};

export const developers = developersJson as unknown as Developer[];

export const getDeveloper = (slug: string) => developers.find((d) => d.slug === slug);

/** Featured first, then the rest — the order the index page shows them in. */
export const featuredDevelopers = () => developers.filter((d) => d.featured);
export const otherDevelopers = () => developers.filter((d) => !d.featured);

/** First description paragraph, whitespace collapsed and cut on a word boundary. */
export function developerExcerpt(d: Developer, max = 140): string | null {
  const text = d.description.find((p) => p && p.trim())?.replace(/\s+/g, " ").trim();
  if (!text) return null;
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : text;
}

// ---- Listings by developer ------------------------------------------------------------------

// Terms too generic to identify a developer's own stock — every Dubai listing would match.
const genericTerms = new Set(["dubai", "uae", "united arab emirates", "emirates", "the uae"]);

/**
 * A whole-word matcher for one project/community name: "Octa" must not match "Octagon", but
 * "Marina Gate" should still match "Marina Gate 1" and multi-space variants of itself.
 */
function termPattern(term: string): RegExp | null {
  const cleaned = term.trim();
  // Two characters is not enough to identify a project ("W1", "AG"), and would match noise.
  if (cleaned.length < 3 || genericTerms.has(cleaned.toLowerCase())) return null;
  const escaped = cleaned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu");
}

/** The project and community names a developer is recognised by, de-duplicated. */
function developerTerms(d: Developer): string[] {
  const seen = new Map<string, string>();
  for (const term of [...d.projects.map((p) => p.name), ...d.communities]) {
    const key = slugify(term ?? "");
    if (key && !seen.has(key)) seen.set(key, term);
  }
  return [...seen.values()];
}

/**
 * Listings that belong to a developer: any whose title, address or community names one of the
 * developer's projects or communities. Returns [] when the developer has no project/community
 * data yet, or when nothing matches.
 */
export function developerProperties(d: Developer, list: Property[] = properties): Property[] {
  const patterns = developerTerms(d)
    .map(termPattern)
    .filter((r): r is RegExp => r !== null);
  if (!patterns.length) return [];
  return list.filter((p) => {
    const haystack = [p.title, ...p.location, p.community].filter(Boolean).join(" | ");
    return patterns.some((re) => re.test(haystack));
  });
}
