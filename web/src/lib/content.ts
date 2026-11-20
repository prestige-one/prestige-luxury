// Read-only access to the content copied from the old WordPress site (see /content/*.json).
import pagesJson from "../../content/pages.json";
import postsJson from "../../content/posts.json";
import categoriesJson from "../../content/categories.json";
import testimonialsJson from "../../content/testimonials.json";
import { site } from "./site";
import { pageTitles } from "./page-seo";
import { brandedTitle, nonIndexablePaths, pageMetadata } from "./seo";

export type Seo = { title: string; description: string; ogImage: string };

export type Page = {
  id: number;
  slug: string;
  parent: number;
  path: string;
  title: string;
  template: string;
  modified: string;
  seo: Seo;
  html: string;
};

export type Post = {
  id: number;
  slug: string;
  path: string;
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  image: string;
  author: string;
  categories: number[];
  tags: number[];
  seo: Seo;
  html: string;
};

export type Category = { id: number; slug: string; name: string; parent: number; count: number; path: string };
export type Tag = { id: number; slug: string; name: string };

/**
 * The WordPress copy still carries retired agency numbers — the 4 446 8302 / 8300 landlines on
 * the contact and landing pages, and a named broker's direct line in two 2023 articles. The
 * owner wants one published number everywhere, so every UAE number in the imported HTML is
 * rewritten to it. Matching requires a `tel:` href or an explicit +971 prefix, so RERA numbers,
 * prices and years are left alone.
 */
const TEL_HREF = /tel:(?:\+|00)?971[\d\s()-]{6,16}/gi;
const TEL_TEXT = /\+971[\s-]*(?:\(0\))?[\s-]*\d[\d\s()-]{5,15}\d/g;

// Display text is rewritten first: doing the href first would leave `tel:+971523702269`
// for the text rule to find and break back apart into a spaced number.
function normalisePhones(html: string): string {
  return html.replace(TEL_TEXT, site.phone).replace(TEL_HREF, site.phoneHref);
}

// (`.test()` is not used here on purpose: these regexes are global, so it would carry
// `lastIndex` from row to row and skip matches.)
const withCurrentPhone = <T extends { html: string; seo: Seo }>(rows: T[]): T[] =>
  rows.map((row) => {
    const html = normalisePhones(row.html);
    // Yoast scraped some descriptions straight off the page, so a retired number can sit in
    // the meta description as well as the body.
    const description = normalisePhones(row.seo.description ?? "");
    if (html === row.html && description === row.seo.description) return row;
    return { ...row, html, seo: { ...row.seo, description } };
  });

export const pages = withCurrentPhone(pagesJson as Page[]);
export const posts = withCurrentPhone(postsJson as Post[]); // newest first
export const categories = categoriesJson as Category[];
export const testimonials = testimonialsJson as { id: number; name: string; html: string; image: string }[];

export const getPage = (path: string) => pages.find((p) => p.path === path);
export const getPost = (path: string) => posts.find((p) => p.path === path);
export const getCategory = (id: number) => categories.find((c) => c.id === id);
export const postsInCategory = (id: number) => posts.filter((p) => p.categories.includes(id));

/**
 * Descriptions written for pages whose WordPress ones were unusable — three pages shared one
 * boilerplate paragraph, and a few held raw page text starting with the heading in capitals.
 * Google rewrites duplicate descriptions, so each page gets its own.
 */
const descriptionOverrides: Record<string, string> = {
  "/": "Explore properties for sale and rent in Dubai with Prestige Luxury. Discover apartments, villas and commercial spaces with personalised expert guidance.",
  "/about/":
    "Prestige Luxury Real Estate is an established Dubai agency bringing together market expertise and a commitment to exceptional client experiences. Read our story.",
  "/areas/":
    "Explore Dubai communities with Prestige Luxury Real Estate. Search waterfront neighbourhoods, urban districts and residential areas, then browse available properties.",
  "/meet-the-team/":
    "Meet the brokers and property specialists at Prestige Luxury Real Estate in Dubai Marina — the people who advise our buyers, sellers, landlords and tenants.",
  "/careers/":
    "Build a real estate career in Dubai with Prestige Luxury Real Estate. See what we look for, what we offer our agents, and apply to join the team.",
  "/services/":
    "Residential and commercial real estate services in Dubai: buying, selling, leasing, off-plan investment, market appraisal and full property management.",
  // Yoast had scraped this one off the contact form itself ("GET IN TOUCH First Name Last
  // Name Mobile Email Message Submit This site is protected by reCAPTCHA…").
  "/contact-us/":
    "Talk to Prestige Luxury Real Estate in Dubai Marina about buying, selling, renting or managing a property in Dubai. Call, WhatsApp, email or visit our Marina Plaza office.",
  "/services/market-appraisal/": "Request a free Dubai property market appraisal from Prestige Luxury. Discuss comparable properties, sale or rental potential and your next steps with a specialist.",
  "/inquiry-form/": "Tell Prestige Luxury what you are looking for in Dubai. Share your preferred location, property type and budget and our team will help with your enquiry.",
  "/projects-for-sale-arabic/": "اكتشف مشاريع عقارية للبيع في دبي مع بريستيج لاكشري. تعرّف على خيارات السكن والاستثمار وتواصل مع فريقنا لمعرفة التفاصيل والتوافر الحالي.",
  "/privacy-policy/": "Read how Prestige Luxury Real Estate collects, uses and protects your personal information, including website enquiries, cookies and your privacy choices.",
  "/terms-and-conditions/": "Read the terms and conditions for using the Prestige Luxury Real Estate website, including property information, enquiries, website content and permitted use.",
  "/testimonials/": "Read client experiences with Prestige Luxury Real Estate in Dubai, from finding a home and renting a property to selling and investing with our team.",
  "/sell/": "Sell your Dubai property with Prestige Luxury. Get local market advice, a considered marketing approach and expert support from listing through to handover.",
  "/blog/": "Explore Dubai real estate news, neighbourhood guides, property insights and practical advice for buyers, tenants, owners and investors from Prestige Luxury.",
  "/dubai-neighbourhoods/": "Explore Dubai neighbourhoods with Prestige Luxury. Discover community lifestyles, amenities and properties to find the right location for your next home or investment.",
};

/** Build Next.js metadata from the old Yoast SEO data so search rankings carry over. */
export function seoMetadata(item: { title: string; seo: Seo; path: string }, options: { image?: string | null } = {}) {
  const title = pageTitles[item.path] || brandedTitle(item.seo.title || item.title);
  const description = descriptionOverrides[item.path] || item.seo.description || `Explore ${item.title} with Prestige Luxury Real Estate in Dubai.`;
  return { ...pageMetadata({ title, description, path: item.path, image: options.image }),
    ...(nonIndexablePaths.has(item.path) ? { robots: { index: false, follow: true } } : {}) };
}
