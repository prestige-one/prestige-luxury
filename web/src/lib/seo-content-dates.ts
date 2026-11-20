/** Maintained when these pages' editorial content or structured SEO information changes.
 * Do not replace feed/article dates with a build timestamp. */
export const editorialModifiedDates: Readonly<Record<string, string>> = Object.fromEntries([
  "/", "/about/", "/contact-us/", "/sell/", "/careers/", "/meet-the-team/", "/testimonials/",
  "/services/", "/services/market-appraisal/", "/areas/", "/dubai-neighbourhoods/", "/frequently-asked-questions/",
  "/privacy-policy/", "/terms-and-conditions/", "/projects-for-sale-arabic/", "/properties/", "/exclusive-collection/",
  "/developers/", "/buyers-guide/", "/property-valuation/", "/tenants-guide/", "/investment-guide/", "/roadshows/", "/branded-residences/",
].map((path) => [path, "2026-11-20"]));
