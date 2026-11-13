import type { Metadata } from "next";
import ListingArchive, { type RawParams } from "@/components/listings/ListingArchive";
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

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  return <ListingArchive title={title} path="/properties/" listings={properties} searchParams={await searchParams} />;
}
