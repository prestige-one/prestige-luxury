import type { Metadata } from "next";
import ListingArchive, { type RawParams } from "@/components/listings/ListingArchive";
import { privateCollection, privateCollectionDescription } from "@/lib/private-collection";
import { pageTitles } from "@/lib/page-seo";
import { pageMetadata } from "@/lib/seo";

const path = "/exclusive-collection/";
const title = pageTitles[path];
export async function generateMetadata({ searchParams }: { searchParams: Promise<RawParams> }): Promise<Metadata> {
  return pageMetadata({ title, description: privateCollectionDescription, path,
    pagination: [{ key: "page", value: (await searchParams).page, total: privateCollection.length }] });
}

export default async function ExclusiveCollectionPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  return <ListingArchive title="The Prestige Private Collection" path={path} listings={privateCollection} searchParams={await searchParams}
    intro={<p className="pl-collection-intro mb-8 max-w-[760px] text-[15px] leading-[1.8] text-muted">{privateCollectionDescription}</p>} />;
}
