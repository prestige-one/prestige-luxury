import { defaultSocialImage } from "@/lib/seo";
import { site } from "@/lib/site";

const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
export type BreadcrumbItem = { name: string; path: string };

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbs = [{ name: "Home", path: "/" }, ...items.filter((item) => item.path !== "/")];
  if (breadcrumbs.length < 2) return null;
  return <script id="pl-breadcrumb-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: new URL(item.path, site.url).href })),
  }) }} />;
}

export function BusinessStructuredData() {
  return <script id="pl-business-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson({
    "@context": "https://schema.org", "@graph": [
      { "@type": "RealEstateAgent", "@id": `${site.url}/#organization`, name: site.name, url: `${site.url}/`,
        description: site.about, logo: `${site.url}${site.logoBlack}`, image: `${site.url}${defaultSocialImage}`,
        telephone: [site.phone, site.officePhone], email: site.email,
        address: { "@type": "PostalAddress", streetAddress: "Office No. 1603, 16th Floor, Marina Plaza, Dubai Marina", addressLocality: "Dubai", addressRegion: "Dubai", addressCountry: "AE" },
        areaServed: { "@type": "City", name: "Dubai" }, sameAs: site.socials.map((social) => social.href) },
      { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: `${site.url}/`, publisher: { "@id": `${site.url}/#organization` } },
    ],
  }) }} />;
}
