import type { Metadata } from "next";
import ListingArchive, { type RawParams } from "@/components/listings/ListingArchive";
import { properties } from "@/lib/properties";
import { site } from "@/lib/site";
import { collectionIntro } from "@/lib/page-seo";
import { pageMetadata } from "@/lib/seo";

const title = collectionIntro.title;
const description = collectionIntro.description;

export async function generateMetadata({ searchParams }: { searchParams: Promise<RawParams> }): Promise<Metadata> {
  return pageMetadata({ title: `${title} | ${site.name}`, description, path: "/properties/",
    pagination: [{ key: "page", value: (await searchParams).page, total: properties.length }] });
}

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  return <ListingArchive title={title} path="/properties/" listings={properties} searchParams={await searchParams} intro={<p className="pl-collection-intro mb-8 max-w-[800px] text-[15px] leading-[1.8] text-muted">{description}</p>} />;
}
