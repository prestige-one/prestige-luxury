// Helpers for the blog (index, archives, single posts). Server-only (uses fs to check images).
import { existsSync } from "node:fs";
import { join } from "node:path";
import { categories, posts, type Category, type Post } from "@/lib/content";

export const POSTS_PER_PAGE = 9;

const fileCache = new Map<string, boolean>();
/** True when a /wp-content/... file was downloaded into /public (a few old uploads are missing). */
export function localFileExists(src: string | undefined | null): boolean {
  if (!src || !src.startsWith("/")) return false;
  const cached = fileCache.get(src);
  if (cached !== undefined) return cached;
  let ok = false;
  try {
    ok = existsSync(join(process.cwd(), "public", decodeURI(src.split("?")[0])));
  } catch {
    ok = false;
  }
  fileCache.set(src, ok);
  return ok;
}

/** Featured image of a post, or null when the file is missing (cards then show a placeholder). */
export const postImage = (post: Post) => (localFileExists(post.image) ? post.image : null);

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };
export function decodeEntities(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n: string) => entities[n.toLowerCase()] ?? m)
    // non-breaking spaces from the WordPress editor stop long titles wrapping on phones
    .replace(/ /g, " ");
}

/** Plain-text excerpt without the WordPress "[…]" suffix. */
export function excerptText(post: Post, max = 160) {
  const text = decodeEntities(post.excerpt).replace(/\s*\[…\]\s*$/, "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text + (post.excerpt.includes("[&hellip;]") ? "…" : "");
  return text.slice(0, text.lastIndexOf(" ", max)).replace(/[,.;:]$/, "") + "…";
}

export function formatDate(iso: string) {
  return new Date(/[zZ]$|[+-]\d\d:\d\d$/.test(iso) ? iso : iso + "Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export const categoriesOf = (post: Post) =>
  post.categories.map((id) => categories.find((c) => c.id === id)).filter((c): c is Category => Boolean(c));

/** The category shown on cards: the most specific one (WordPress' generic "Blog" only as a last resort). */
export function primaryCategory(post: Post) {
  const cats = categoriesOf(post);
  return cats.find((c) => c.parent !== 0) ?? cats.find((c) => c.slug !== "blog") ?? cats[0];
}

/** Categories that have posts (only those get an archive page). */
export const activeCategories = categories.filter((c) => posts.some((p) => p.categories.includes(c.id)));

export const postsInCategory = (c: Category) => posts.filter((p) => p.categories.includes(c.id));

export const pageCount = (n: number) => Math.max(1, Math.ceil(n / POSTS_PER_PAGE));
export const pageSlice = <T,>(list: T[], page: number) => list.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

/** Up to `n` other posts sharing the most categories (newest first on ties). */
export function relatedPosts(post: Post, n = 3) {
  const generic = categories.find((c) => c.slug === "blog")?.id;
  const score = (p: Post) =>
    p.categories.filter((c) => post.categories.includes(c)).reduce((s, c) => s + (c === generic ? 1 : 3), 0);
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.p.date.localeCompare(a.p.date))
    .slice(0, n)
    .map((x) => x.p);
}

/** Older/newer neighbours in the date-sorted list. */
export function adjacentPosts(post: Post) {
  const i = posts.findIndex((p) => p.id === post.id);
  return { newer: i > 0 ? posts[i - 1] : undefined, older: i < posts.length - 1 ? posts[i + 1] : undefined };
}

/**
 * Tidy the WordPress post HTML: drop empty paragraphs, images whose files were not downloaded,
 * srcset lists (they reference resized copies), WP font-size inline styles and absolute links to the old domain.
 * It also fixes accessibility/validity problems in the pasted editor markup: in-body `<h1>`s are
 * demoted (the page title is the only h1), images without an `alt` attribute get an empty one,
 * and schemeless hrefs like `prestigeluxury.ae` are made absolute instead of resolving against the post URL.
 */
export function cleanPostHtml(html: string) {
  let out = html
    .replace(/https?:\/\/(www\.)?prestigeluxury\.ae(?=\/)/g, "")
    .replace(/\s(srcset|sizes)="[^"]*"/g, "")
    // in-body headings: the post title is the page's only <h1>
    .replace(/<(\/?)h1\b/gi, "<$1h2")
    // every image needs an alt attribute; decorative ones get an empty one
    .replace(/<img\b([^>]*?)(\/?)>/gi, (tag, attrs: string, slash: string) =>
      /\salt\s*=/i.test(attrs) ? tag : `<img${attrs} alt=""${slash ? " /" : ""}>`,
    )
    .replace(/href="([^"]*)"/gi, (attr, href: string) => {
      // bare-domain links ("prestigeluxury.ae") would otherwise resolve relative to the post URL
      if (/^(https?:|mailto:|tel:|#|\/|\?)/i.test(href)) return attr;
      const bareDomain = /^(www\.)?[\w-]+(\.[a-z]{2,24})+(?=[/?#]|$)/i.test(href) && !/\.(pdf|jpe?g|png|webp|gif|svg|docx?|xlsx?|zip|mp4)(?=[?#]|$)/i.test(href);
      if (!bareDomain) return attr;
      const onOurSite = href.replace(/^(www\.)?prestigeluxury\.ae/i, "");
      return onOurSite !== href ? `href="${onOurSite || "/"}"` : `href="https://${href}"`;
    })
    .replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g, (tag, src: string) => (src.startsWith("/") && !localFileExists(src) ? "" : tag))
    .replace(/\sstyle="([^"]*)"/g, (_, css: string) => {
      const kept = css
        .split(";")
        .map((d) => d.trim())
        .filter((d) => d && !/^(font-size|font-family)\s*:/i.test(d));
      return kept.length ? ` style="${kept.join("; ")};"` : "";
    })
    .replace(/<iframe\b/g, '<iframe loading="lazy"');
  // Remove wrappers left empty by the steps above (repeat for nesting).
  for (let i = 0; i < 3; i++) {
    out = out
      .replace(/<p[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>/g, "")
      .replace(/<a\b[^>]*>\s*<\/a>/g, "")
      .replace(/<figure\b[^>]*>\s*(<figcaption[^>]*>[\s\S]*?<\/figcaption>)?\s*<\/figure>/g, "");
  }
  return out.replace(/\n{3,}/g, "\n\n").trim();
}

export function postsWithPrefix(prefix: string) {
  return posts.filter((p) => p.path.startsWith(prefix) && /^[^/]+\/$/.test(p.path.slice(prefix.length)));
}
