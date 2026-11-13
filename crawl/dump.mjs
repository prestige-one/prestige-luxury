// Dumps public WordPress REST content from prestigeluxury.ae into ./data/*.json
import { writeFile, mkdir } from 'node:fs/promises';

const BASE = 'https://prestigeluxury.ae/wp-json';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';
const OUT = new URL('./data/', import.meta.url);

const endpoints = {
  pages: 'wp/v2/pages',
  posts: 'wp/v2/posts',
  media: 'wp/v2/media',
  categories: 'wp/v2/categories',
  tags: 'wp/v2/tags',
  agencies: 'wp/v2/agencies',
  agents: 'wp/v2/agents',
  testimonials: 'wp/v2/houzez_testimonials',
  floating_buttons: 'wp/v2/e-floating-buttons',
  property_type: 'wp/v2/property_type',
  property_status: 'wp/v2/property_status',
  property_area: 'wp/v2/property_area',
  property_city: 'wp/v2/property_city',
  menu_items: 'wp/v2/menu-items',
  menus: 'wp/v2/menus',
};

async function getAll(path) {
  const all = [];
  for (let page = 1; ; page++) {
    const url = `${BASE}/${path}?per_page=100&page=${page}`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return { error: res.status, items: all };
    const items = await res.json();
    all.push(...items);
    const totalPages = Number(res.headers.get('x-wp-totalpages') || 1);
    if (page >= totalPages || !items.length) break;
  }
  return { items: all };
}

await mkdir(OUT, { recursive: true });
for (const [name, path] of Object.entries(endpoints)) {
  const { items, error } = await getAll(path);
  await writeFile(new URL(`${name}.json`, OUT), JSON.stringify(items, null, 1));
  console.log(`${name}: ${items.length}${error ? ` (HTTP ${error})` : ''}`);
}
