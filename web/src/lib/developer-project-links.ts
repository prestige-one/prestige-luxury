// Project destinations verified against https://prestigeone.ae/projects on 19 November 2026.
// Keep projects without a published destination as plain text.
const prestigeOneProjects: Readonly<Record<string, string>> = {
  "FAUCHON Résidences by Prestige One": "fauchon-residences-by-prestige-one",
  "Sanctuary Residences by Prestige One": "sanctuary-residences-by-prestige-one",
  "Sanctuary Hive by Prestige One": "sanctuary-hive-by-prestige-one",
  "Hilton Residences by Prestige One": "hilton-residences-dubai-maritime-city",
  "Berkeley Square North": "berkeley-square-north",
  "Berkeley Square South": "berkeley-square-south",
  "Luxury Canal Residences": "luxury-canal-residences-by-prestige-one",
  "Coastal Haven by Prestige Harbour": "coastal-haven-by-prestige-one",
  "The Boulevard by Prestige One": "the-boulevard-by-prestige-one",
  "Parkway by Prestige One": "parkway-by-prestige-one",
  "Golf Residences by Prestige One": "golf-residences-by-prestige-one",
  "The One by Prestige One": "the-one-by-prestige-one",
  "Seaside by Prestige One": "seaside-by-prestige-one",
  "The Waterway by Prestige One": "waterway-by-prestige-one",
  "Vista by Prestige One": "vista-by-prestige-one",
  "The Residence by Prestige One": "the-residence-by-prestige-one",
  "Luxe Villa": "luxe-villa-by-prestige-one",
};

export function developerProjectUrl(developerSlug: string, projectName: string): string | undefined {
  if (developerSlug !== "prestige-one-developments") return undefined;
  const project = Object.hasOwn(prestigeOneProjects, projectName) ? prestigeOneProjects[projectName] : undefined;
  return project ? `https://prestigeone.ae/projects/${project}` : undefined;
}
