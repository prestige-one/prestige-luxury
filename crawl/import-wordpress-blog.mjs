// Import published WXR posts only. Run with the export path; add --plan to inspect without writing.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { load } from 'cheerio';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.join(root, 'web/public');
const output = path.join(publicDir, 'images/blog');
const contentDir = path.join(root, 'web/content');
const sharp = createRequire(path.join(root, 'web/package.json'))('sharp');
const source = process.argv[2];
if (!source) throw new Error('Provide the WordPress XML export path.');
const $ = load(readFileSync(source, 'utf8').trimStart(), { xml: true });
const text = (el, name) => $(el).find(name.replace(':', '\\:')).first().text().trim();
const items = $('item').toArray();
const posts = items.filter((el) => text(el, 'wp:post_type') === 'post' && text(el, 'wp:status') === 'publish');
const attachments = new Map(items.filter((el) => text(el, 'wp:post_type') === 'attachment').map((el) => [text(el, 'wp:post_id'), text(el, 'wp:attachment_url')]));
const imageOverrides = JSON.parse(readFileSync(path.join(contentDir, 'blog-image-overrides.json'), 'utf8'));
const oldPosts = JSON.parse(readFileSync(path.join(contentDir, 'posts.json'), 'utf8'));
const oldById = new Map(oldPosts.map((post) => [post.id, post]));
const categories = JSON.parse(readFileSync(path.join(contentDir, 'categories.json'), 'utf8'));
const byCategory = new Map(categories.map((category) => [category.slug, category]));
const metadata = (el) => Object.fromEntries($(el).find('wp\\:postmeta').toArray().map((meta) => [text(meta, 'wp:meta_key'), text(meta, 'wp:meta_value')]));
const absolute = (url) => { try { return new URL(url, 'https://prestigeluxury.ae').href; } catch { return ''; } };
const urls = new Set();
const drafts = posts.map((el) => {
  const meta = metadata(el);
  const id = Number(text(el, 'wp:post_id'));
  const slug = text(el, 'wp:post_name');
  const image = absolute(imageOverrides.featured[slug] || attachments.get(meta._thumbnail_id) || '/images/downtown-dubai.webp');
  if (image && image !== 'https://prestigeluxury.ae/') urls.add(image);
  let html = text(el, 'content:encoded').replace(/<!--[^]*?-->/g, '').replace(/\[\/?caption[^\]]*\]/g, '')
    .replace(/\[embed\]\s*(https?:\/\/[^\s<]+)\s*\[\/embed\]/g, '<a href="$1">Watch the related video</a>');
  // WordPress auto-paragraphs classic-editor text when rendering; WXR holds the raw text.
  html = html.split(/\n\s*\n/).map((block) => /^\s*<(?:p|h[1-6]|ul|ol|li|div|figure|table|blockquote|section|\/)/i.test(block) ? block : `<p>${block.replace(/\n/g, '<br>')}</p>`).join('\n');
  const dom = load(html, {}, false);
  dom('img').each((_, img) => {
    const url = absolute(dom(img).attr('data-src') || dom(img).attr('src') || '');
    if (url && !/forkcdn\.com/i.test(url)) urls.add(url);
  });
  const cats = $(el).find('category[domain="category"]').toArray().map((category) => {
    const slug = $(category).attr('nicename');
    if (!byCategory.has(slug)) {
      const added = { id: Math.max(...categories.map((c) => c.id)) + 1, slug, name: $(category).text(), parent: 0, count: 0, path: `/category/${slug}/` };
      categories.push(added); byCategory.set(slug, added);
    }
    return byCategory.get(slug).id;
  });
  return {
    id, slug: text(el, 'wp:post_name'), path: new URL(text(el, 'link')).pathname,
    title: text(el, 'title'), date: text(el, 'wp:post_date_gmt').replace(' ', 'T') + 'Z',
    modified: text(el, 'wp:post_modified_gmt').replace(' ', 'T') + 'Z',
    author: 'Prestige Luxury Real Estate',
    categories: cats, tags: [], image, html,
    seo: { title: meta._yoast_wpseo_title?.includes('%%') ? '' : meta._yoast_wpseo_title || '', description: meta._yoast_wpseo_metadesc || '', ogImage: image },
  };
});
const normalizeFilename = (name) => name.toLowerCase().replace(/-\d+x\d+/g, '').replace(/-\d+(?=\.)/, '');
const uploadDir = path.join(publicDir, 'wp-content/uploads');
const originalFiles = new Map();
for (const entry of readdirSync(uploadDir, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const key = normalizeFilename(entry.name);
  if (!originalFiles.has(key) || !/-\d+x\d+/.test(entry.name)) originalFiles.set(key, path.join(entry.parentPath, entry.name));
}
const cachedFile = (url) => {
  const replacement = imageOverrides.inline[url];
  if (replacement) return path.join(publicDir, replacement.src);
  const parsed = new URL(url);
  if (!['prestigeluxury.ae', 'www.prestigeluxury.ae'].includes(parsed.hostname)) return null;
  const candidate = path.resolve(publicDir, '.' + decodeURIComponent(parsed.pathname));
  return candidate.startsWith(publicDir + path.sep) && existsSync(candidate) ? candidate : originalFiles.get(normalizeFilename(path.basename(parsed.pathname))) || null;
};
if (process.argv.includes('--plan')) {
  console.log(JSON.stringify({ posts: drafts.length, images: urls.size, cachedOriginals: [...urls].filter(cachedFile).length, categories: new Set(drafts.flatMap((p) => p.categories)).size }));
  process.exit(0);
}
mkdirSync(output, { recursive: true });
const mapping = new Map(), failures = [];
const queue = [...urls];
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < queue.length) {
    const url = queue[cursor++];
    const name = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'image').replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[^a-z0-9-]/gi, '-').slice(0, 75);
    const filename = `${name}-${createHash('sha256').update(url).digest('hex').slice(0, 10)}.webp`;
    const dest = path.join(output, filename);
    try {
      if (!existsSync(dest)) {
        const cached = cachedFile(url);
        let bytes;
        if (cached) bytes = readFileSync(cached);
        else {
          let res = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { 'User-Agent': 'PrestigeLuxury-BlogMigration/1.0' } });
          if (res.status === 404 && /-\d+x\d+\./.test(url)) {
            res = await fetch(url.replace(/-\d+x\d+(?=\.)/, ''), { signal: AbortSignal.timeout(20_000) });
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          bytes = Buffer.from(await res.arrayBuffer());
        }
        await sharp(bytes, { limitInputPixels: 80_000_000 }).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toFile(dest);
      }
      mapping.set(url, `/images/blog/${filename}`);
    } catch (error) { failures.push({ url, reason: error.message }); }
  }
}));

const pathsBySlug = new Map(drafts.map((post) => [post.slug, post.path]));
const clean = (html) => {
  const dom = load(html, {}, false);
  dom('script,style,iframe,object,embed,form,input,button,link,meta').remove();
  dom('h1').each((_, el) => { el.tagName = 'h2'; });
  dom('*').each((_, el) => {
    if (el.tagName === 'img' && dom(el).attr('data-src')) dom(el).attr('src', dom(el).attr('data-src'));
    for (const attr of Object.keys(el.attribs || {})) {
      if (/^(?:on|data-)/i.test(attr) || ['style','class','id','srcset','sizes'].includes(attr)) dom(el).removeAttr(attr);
    }
  });
  dom('img').each((_, img) => {
    const el = dom(img), original = absolute(el.attr('src') || ''), local = mapping.get(original);
    if (!local) { el.remove(); return; }
    el.attr({ src: local, alt: imageOverrides.inline[original]?.alt || el.attr('alt') || '', loading: 'lazy', decoding: 'async' }).removeAttr('height').removeAttr('width');
  });
  dom('a').each((_, anchor) => {
    const el = dom(anchor), href = el.attr('href') || '';
    el.find('*').addBack().contents().each((_, node) => {
      if (node.type === 'text') node.data = node.data.replace(/https?:\/\/[^\s]+/g, 'View details');
    });
    if (/^(?:javascript|data|vbscript):/i.test(href)) { el.removeAttr('href'); return; }
    if (!href || /^(?:#|mailto:|tel:)/i.test(href)) return;
    let url;
    try { url = new URL(/^(?:www\.|prestigeluxury\.ae)/i.test(href) ? `https://${href}` : href, 'https://prestigeluxury.ae'); } catch { el.removeAttr('href'); return; }
    const media = mapping.get(url.href);
    if (media) el.attr('href', media).removeAttr('target').removeAttr('rel');
    else if (['prestigeluxury.ae', 'www.prestigeluxury.ae'].includes(url.hostname)) {
      const slug = url.pathname.split('/').filter(Boolean).at(-1);
      el.attr('href', (pathsBySlug.get(slug) || url.pathname) + url.search + url.hash).removeAttr('target').removeAttr('rel');
      if (/\.(?:png|jpe?g|webp|gif)$/i.test(url.pathname)) el.removeAttr('href');
    } else el.attr({ href: url.href, target: '_blank', rel: 'noopener noreferrer' });
  });
  for (let i = 0; i < 3; i++) dom('p,a,figure').each((_, el) => { if (!dom(el).text().trim() && !dom(el).find('img').length) dom(el).remove(); });
  return dom.html().replace(/\[\/?embed\]/g, '').trim();
};
const result = drafts.map((post) => {
  const html = clean(post.html), plain = load(html).text().replace(/\s+/g, ' ').trim();
  const excerpt = plain.length > 190 ? plain.slice(0, plain.lastIndexOf(' ', 190)) + '…' : plain;
  const image = mapping.get(post.image) || '';
  return { ...post, image, html, excerpt, seo: { title: post.seo.title || `${post.title} | Prestige Luxury Real Estate`, description: post.seo.description || excerpt, ogImage: image } };
}).sort((a, b) => b.date.localeCompare(a.date));
for (const category of categories) category.count = result.filter((post) => post.categories.includes(category.id)).length;
writeFileSync(path.join(contentDir, 'posts.json'), JSON.stringify(result, null, 1));
writeFileSync(path.join(contentDir, 'categories.json'), JSON.stringify(categories, null, 1));
const redirectFile = path.join(contentDir, 'blog-redirects.json');
const redirects = new Map((existsSync(redirectFile) ? JSON.parse(readFileSync(redirectFile, 'utf8')) : []).map((entry) => [entry.source, entry]));
for (const post of result) {
  const prior = oldById.get(post.id);
  if (prior && prior.path !== post.path) redirects.set(prior.path, { source: prior.path, destination: post.path });
}
writeFileSync(redirectFile, JSON.stringify([...redirects.values()], null, 2));
const report = { source: path.basename(source), posts: result.length, images: mapping.size, missingImages: failures, localReplacements: imageOverrides, categories: categories.filter((c) => c.count > 0).length, assets: Object.fromEntries(mapping) };
mkdirSync(path.join(root, 'docs/blog'), { recursive: true });
writeFileSync(path.join(root, 'docs/blog/import-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ posts: result.length, images: mapping.size, failures: failures.length, postsWithoutFeaturedImage: result.filter((p) => !p.image).map((p) => p.slug) }));
