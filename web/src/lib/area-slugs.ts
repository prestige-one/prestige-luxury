/** URL aliases belong to presentation code, never to the CRM's location records. */
export const areaSlugAliases: Readonly<Record<string, string>> = {
  "nadd-al-sheba": "nad-al-sheba",
  downtown: "downtown-dubai",
  "sports-city": "dubai-sports-city",
};
export const canonicalAreaSlug = (slug: string) => Object.hasOwn(areaSlugAliases, slug) ? areaSlugAliases[slug] : slug;
