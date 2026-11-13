// Prints a compact outline of an Elementor page's content: sections, headings, text, images, buttons.
// Usage: node outline.mjs <page-slug|id> [maxTextLen]
import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

const [key, maxArg] = process.argv.slice(2);
const max = Number(maxArg || 160);
const all = [...JSON.parse(readFileSync(new URL('./data/pages.json', import.meta.url))), ...JSON.parse(readFileSync(new URL('./data/posts.json', import.meta.url)))];
const page = all.find((p) => String(p.id) === key || p.slug === key);
if (!page) { console.error('not found'); process.exit(1); }
const $ = cheerio.load(page.content.rendered);
const short = (s) => s.replace(/\s+/g, ' ').trim().slice(0, max);
const rel = (u) => (u || '').replace('https://prestigeluxury.ae', '');

console.log(`# ${page.title.rendered}  (id ${page.id}, /${page.slug}/)`);
const top = $('.elementor').first().children('.elementor-element, .elementor-section, .e-con');
top.each((i, sec) => {
  const s = $(sec);
  console.log(`\n## section ${i} [${s.attr('data-id')}] ${s.attr('class').split(' ').filter((c) => /section|con|stretch|full/.test(c)).slice(0, 3).join(' ')}`);
  s.find('[data-widget_type]').each((_, w) => {
    const el = $(w);
    const type = el.attr('data-widget_type').split('.')[0];
    const txt = short(el.text());
    const imgs = el.find('img').map((_, im) => rel($(im).attr('src'))).get().slice(0, 6);
    const links = el.find('a[href]').map((_, a) => `${short($(a).text()).slice(0, 30)}>${rel($(a).attr('href'))}`).get().filter((l) => !l.startsWith('>')).slice(0, 4);
    const settings = el.attr('data-settings');
    let bg = '';
    if (settings) { try { const j = JSON.parse(settings); bg = j.background_image?.url ? ' bg:' + rel(j.background_image.url) : ''; } catch {} }
    console.log(`  - ${type}: ${txt}${imgs.length ? ' | img: ' + imgs.join(', ') : ''}${links.length ? ' | a: ' + links.join(', ') : ''}${bg}`);
  });
});
