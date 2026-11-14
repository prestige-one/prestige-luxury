import type { Developer } from "./developers";

type DeveloperImage = { src: string; alt: string };

// Local project photography where available; community photos are labelled as communities,
// never presented as an unidentified building belonging to a particular developer.
const featured: Record<string, DeveloperImage> = {
  "prestige-one-developments": { src: "/wp-content/uploads/2023/05/The-Residence-banner-5-scaled-1.jpg", alt: "The Residence by Prestige One in Jumeirah Village Circle" },
  "emaar-properties": { src: "/images/blog/SIRDHANA-by-EMAAR-properties-329d24bc0e.webp", alt: "Sirdhana by Emaar Properties" },
  "damac-properties": { src: "/images/blog/damac-properties-1024x576-84683db6e1.webp", alt: "DAMAC residential development in Dubai" },
  nakheel: { src: "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg", alt: "Palm Jumeirah, a Nakheel master community" },
  meraas: { src: "/images/blog/dubai-city-walk-781f808b78.webp", alt: "City Walk, a Meraas destination in Dubai" },
};

const communities: [RegExp, DeveloperImage][] = [
  [/dubai islands/i, { src: "/images/dubai-Islands-1.webp", alt: "The Dubai Islands waterfront community" }],
  [/palm jumeirah/i, { src: "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg", alt: "Aerial view of Palm Jumeirah" }],
  [/maritime/i, { src: "/images/dubai-maritime.webp", alt: "Dubai Maritime City waterfront" }],
  [/sports city/i, { src: "/images/dubai-sport-city-1.webp", alt: "Dubai Sports City and its golf course" }],
  [/meydan|mohammed bin rashid/i, { src: "/wp-content/uploads/2019/05/mbr-city-dubai.jpg", alt: "The Mohammed Bin Rashid City district in Dubai" }],
  [/jumeirah village circle/i, { src: "/wp-content/uploads/2019/05/jumeirah-village-circle.jpg", alt: "Jumeirah Village Circle, Dubai" }],
];
const skyline = { src: "/images/downtown-dubai.webp", alt: "Dubai's Downtown skyline" };

export function developerCardImage(d: Developer): DeveloperImage {
  if (featured[d.slug]) return featured[d.slug];
  const location = d.communities[0] || "";
  return communities.find(([pattern]) => pattern.test(location))?.[1] || skyline;
}
