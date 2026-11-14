import type { Metadata } from "next";
import ListingArchive, { type RawParams } from "@/components/listings/ListingArchive";
import { properties } from "@/lib/properties";
import { site } from "@/lib/site";
import { collectionIntro } from "@/lib/page-seo";

const title = collectionIntro.title;
const description = collectionIntro.description;

export const metadata: Metadata = {
  title: { absolute: `${title} | ${site.name}` },
  description,
  alternates: { canonical: "/properties/" },
  openGraph: { title: `${title} | ${site.name}`, description, url: "/properties/" },
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  return <ListingArchive title={title} path="/properties/" listings={properties} searchParams={await searchParams} intro={<p className="pl-collection-intro mb-8 max-w-[800px] text-[15px] leading-[1.8] text-muted">{description}</p>} />;
}
