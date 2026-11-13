import type { Metadata } from "next";
import ListingArchive from "@/components/listings/ListingArchive";
import { properties } from "@/lib/properties";
import { site } from "@/lib/site";

const title = "Properties";
const description = "Browse apartments, villas, townhouses and commercial properties for sale and rent in Dubai with Prestige Luxury Real Estate.";

export const metadata: Metadata = {
  title: { absolute: `${title} | ${site.name}` },
  description,
  alternates: { canonical: "/properties/" },
  openGraph: { title: `${title} | ${site.name}`, description, url: "/properties/" },
};

export default function PropertiesPage() {
  return <ListingArchive title={title} listings={properties} />;
}
