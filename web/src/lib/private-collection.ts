import { properties } from "./properties";

/** Premium residential sale listings, taken from the same live inventory as the archives. */
export const privateCollection = properties.filter((p) => p.purpose === "sale" && p.price >= 5_000_000 && p.images.length && /^(apartment|villa|townhouse|penthouse)$/i.test(p.type)).sort((a, b) => b.price - a.price);

// The homepage shows three different communities rather than three units in one building.
const communities = new Set<string>();
export const privateHighlights = privateCollection.filter((p) => {
  if (communities.size === 3 || communities.has(p.community)) return false;
  communities.add(p.community);
  return true;
});

export const privateCollectionDescription = "Explore an exclusive selection of Dubai's finest properties, from waterfront penthouses to private villas.";
