# Rebuild of prestigeluxury.ae — notes for builders

We are rebuilding the WordPress site **prestigeluxury.ae** (Houzez theme + Elementor) as a **Next.js 16 / React 19 / Tailwind v4** site in `web/`, to be hosted on Vercel. It must look and read like the original (same text, images, layout, URLs), but be clean modern code — no WordPress, no Elementor runtime.

## What already exists (do NOT modify these shared files)
- `web/src/app/layout.tsx` (root html/body, Poppins + Roboto fonts), `web/src/app/globals.css` (tokens + `.wp-content` rich-text styles)
- `web/src/app/(site)/layout.tsx` — Header + Footer wrapper for normal pages. Put normal pages under `web/src/app/(site)/...`
- `web/src/components/Header.tsx`, `Footer.tsx`, `HeroSearch.tsx`, `ScrollTop.tsx`, `icons.tsx` (`SocialIcon`)
- `web/src/components/ui.tsx` — `Container`, `SectionTitle`, `Button`, `PageBanner`, `Breadcrumb`, `WpContent` (renders WP HTML), `ImageCard`
- `web/src/components/LeadForm.tsx` — the ONLY form component; posts to `/api/lead`. Props: `form` (name in email subject), `fields`, `submitLabel`, `redirectTo`, `extra`, `dark`.
- `web/src/lib/site.ts` (contact details, nav, footer links), `web/src/lib/content.ts` (pages/posts/categories/tags/testimonials + `seoMetadata()`), `web/src/lib/properties.ts` (listing type + search helpers)
- Homepage `web/src/app/(site)/page.tsx` — look at it as the reference for code style.

If you need a new shared helper, create it in your own folder `web/src/components/<your-group>/` instead of editing shared files.

## Where the original content is
- **Outline of any original page/post** (sections, headings, text, images, links): `node crawl/outline.mjs <slug-or-id> [maxTextLen]` (run from repo root `D:\projects\luxp`). Use a big maxTextLen (e.g. 2000) to get full text.
- Full original HTML: `web/content/pages.json` / `posts.json` (field `html`), with SEO data in `seo`.
- Original Elementor CSS per page (colours, font sizes, spacing, background images): `web/public/wp-content/uploads/elementor/css/post-<pageId>.css`
- **All images are already downloaded** to `web/public/wp-content/uploads/...` with the same paths as the live site. Use them with `next/image` (`src="/wp-content/uploads/..."`). Check the file exists before using it (a few old ones are missing; skip those).
- The live site is behind bot protection: fetching its HTML pages with curl returns a "One moment, please" challenge — do not try to get around it. The REST API (`https://prestigeluxury.ae/wp-json/wp/v2/...`) works if you really need something extra.

## Design language (Houzez)
- Fonts: Poppins (body, `font-sans`), Roboto (`font-heading`, used for section titles).
- Colours (Tailwind tokens): `ink` #000, `body` #222, `muted` #6b6b6b, `line` #e6e6e6, `cream` #faf8f4, `mist` #f8f8f8, `smoke` #f0f0f0, `accent` #835a5a.
- Inner pages: solid black header (automatic), then the page content. Containers max ~1140px. Square-ish corners (2px), black buttons that turn accent on hover, light borders, generous whitespace (sections ~80–100px vertical padding).
- Mobile-first responsive; everything must work at 375px wide.

## Next.js 16 rules
- Route params are Promises: `export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; }` — same for `searchParams`. Same in `generateMetadata`.
- Content routes: use `generateStaticParams()` and `export const dynamicParams = false` where the set of URLs is known.
- `trailingSlash: true` is on: all internal links end with `/`.
- Keep the original URL of every page (SEO). Set metadata with `seoMetadata(item)` from `lib/content.ts` where the item has `seo`.
- Bundled docs: `web/node_modules/next/dist/docs/` if unsure about an API.

## How to check your work
- Typecheck: `cd web && npx tsc --noEmit`; lint your files: `npx eslint <files>`.
- A dev server is ALREADY running at http://localhost:3100 (hot reload). Check your routes with curl, e.g. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/about/` and grep the HTML for expected text.
- Do NOT run `next build`, do NOT start another dev server, do NOT `git commit`, do NOT install packages without a strong reason (say so in your report if you did).
- Only create/edit files for your assigned routes.

## Report back
List: routes built, files created, anything skipped or uncertain, and anything the owner of the site must provide (e.g. missing info).
