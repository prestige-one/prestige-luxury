# Blog content

Published posts are imported from the supplied WordPress WXR export. Drafts, comments,
author account details and unrelated WordPress metadata are not imported.

- `web/content/posts.json`: article content, original URLs, dates, metadata and category IDs.
- `web/content/categories.json`: category names, original archive URLs and current article counts.
- `web/content/blog-redirects.json`: permanent redirects from the 12 earlier imported URLs to export canonicals.
- `web/public/images/blog/`: local WebP assets, capped at 1600 pixels wide.
- `web/src/components/blog/`: shared archive, article, card, navigation and share components.
- `web/src/app/sitemap.ts`: canonical public routes, articles, categories and pagination.
- `docs/blog/import-report.json`: image source mapping and unavailable source images.

## Import and validation

From the repository root, install the existing importer dependencies with `npm ci --prefix crawl`.
Then run `node crawl/import-wordpress-blog.mjs "PATH_TO_EXPORT.xml" --plan` to inspect,
and omit `--plan` to import. Existing downloaded originals are reused. Missing images are
fetched with bounded concurrency; originals are encoded to WebP for local delivery.

Run `node crawl/check-blog.mjs` for content checks, or
`node crawl/check-blog.mjs http://127.0.0.1:3000` to also validate routes and the sitemap.
`web/content/blog-image-overrides.json` maps seven unavailable inline images and two missing
featured thumbnails to relevant assets in the local library. The importer applies those choices
on every run and records them in the report. No article uses an agency-logo thumbnail or a
remote image. Individual author bylines are omitted; organization authorship is used in metadata.

Blog and category archives use the same responsive three-column card grid (nine articles per page),
with inline category filters instead of sidebars. Article pages repeat categories above and below
the content. Their title banners are black with white text; the reading area remains white.

Dates and historical copy are preserved. Original article and category paths remain canonical.
External editorial links open in a new tab with `noopener noreferrer`; old tag archives redirect
permanently to `/blog/` and are excluded from the sitemap. Preview hosts remain blocked by robots.txt.
