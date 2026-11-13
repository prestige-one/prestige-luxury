// Turns the raw WordPress REST dump into lean JSON the Next.js app reads at build time.
// Output: ../web/content/*.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE = 'https://prestigeluxury.ae';
const read = (f) => JSON.parse(readFileSync(new URL(`./data/${f}`, import.meta.url), 'utf8'));
const out = new URL('../web/content/', import.meta.url);
mkdirSync(out, { recursive: true });
const write = (f, d) => writeFileSync(new URL(f, out), JSON.stringify(d, null, 1));

const rel = (s = '') => s.replaceAll(`${SITE}/`, '/').replaceAll(SITE, '/').replaceAll('http://prestigeluxury.ae/', '/');
const decode = (s = '') => s.replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&#8216;/g, '‘').replace(/&#8220;/g, '“').replace(/&#8221;/g, '”').replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#8230;/g, '…');
const seo = (p) => {
  const y = p.yoast_head_json || {};
  return { title: decode(y.title || ''), description: decode(y.description || y.og_description || ''), ogImage: rel(y.og_image?.[0]?.url || '') };
};
const media = read('media.json');
const mediaUrl = (id) => rel(media.find((m) => m.id === id)?.source_url || '');

const pages = read('pages.json').map((p) => ({
  id: p.id, slug: p.slug, parent: p.parent, path: new URL(p.link).pathname, title: decode(p.title.rendered),
  template: p.template, modified: p.modified, seo: seo(p), html: rel(p.content.rendered),
}));
write('pages.json', pages);

const categories = read('categories.json').map((c) => ({ id: c.id, slug: c.slug, name: decode(c.name), parent: c.parent, count: c.count, path: new URL(c.link).pathname }));
write('categories.json', categories);
const tags = read('tags.json').map((t) => ({ id: t.id, slug: t.slug, name: decode(t.name) }));
write('tags.json', tags);

const posts = read('posts.json').map((p) => {
  const y = p.yoast_head_json || {};
  return {
    id: p.id, slug: p.slug, path: new URL(p.link).pathname, title: decode(p.title.rendered), date: p.date, modified: p.modified,
    excerpt: decode(p.excerpt.rendered.replace(/<[^>]+>/g, '').trim()),
    image: mediaUrl(p.featured_media) || rel(y.og_image?.[0]?.url || ''),
    author: y.author || 'Prestige Luxury Real Estate',
    categories: p.categories, tags: p.tags, seo: seo(p), html: rel(p.content.rendered),
  };
}).sort((a, b) => b.date.localeCompare(a.date));
write('posts.json', posts);

const agents = read('agents.json').map((a) => ({
  id: a.id, slug: a.slug, name: decode(a.title.rendered), html: rel(a.content.rendered), image: mediaUrl(a.featured_media),
  meta: Object.fromEntries(Object.entries(a.meta || {}).filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && !v.length))),
}));
write('agents.json', agents);

const testimonials = read('testimonials.json').map((t) => ({ id: t.id, name: decode(t.title.rendered), html: rel(t.content?.rendered || ""), image: mediaUrl(t.featured_media), meta: t.meta }));
write('testimonials.json', testimonials);

console.log({ pages: pages.length, posts: posts.length, categories: categories.length, agents: agents.length, testimonials: testimonials.length });
