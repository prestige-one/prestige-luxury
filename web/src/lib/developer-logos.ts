import fs from "node:fs";
import path from "node:path";

/**
 * Developer logo files, looked up by developer slug.
 *
 * The files live in `public/brand/developers/<slug>.<ext>` and are each developer's own mark,
 * taken from that developer's own website — never from another agency's media library, which is
 * how the previous logo strip came to be advertising a competitor's asset set.
 *
 * The folder is read once at build time (this module is server-only, imported from server
 * components), so adding a file is all it takes for that developer's logo to appear; a developer
 * with no file simply falls back to their name, and the strip still renders.
 */
const dir = path.join(process.cwd(), "public", "brand", "developers");
const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];

const bySlug = new Map<string, string>();
for (const file of files) {
  const slug = file.replace(/\.[^.]+$/, "");
  // first match wins, so a hand-placed SVG beats a downloaded PNG of the same slug
  if (!bySlug.has(slug)) bySlug.set(slug, `/brand/developers/${file}`);
}

export function developerLogo(slug: string): string | null {
  return bySlug.get(slug) ?? null;
}

export const hasDeveloperLogos = bySlug.size > 0;
