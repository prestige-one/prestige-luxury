import { properties } from "./properties";

/** Premium residential sale listings, taken from the same live inventory as the archives. */
export const privateCollection = properties.filter((p) => p.purpose === "sale" && p.price >= 5_000_000 && p.images.length && /^(apartment|villa|townhouse|penthouse)$/i.test(p.type)).sort((a, b) => b.price - a.price);

export const privateCollectionDescription = "Explore an exclusive selection of Dubai's finest properties, from waterfront penthouses to private villas.";
