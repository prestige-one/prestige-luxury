import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingArchive from "@/components/listings/ListingArchive";
import { allAreas, propertiesInArea } from "@/lib/listing-views";
import { site } from "@/lib/site";

// Every community with listings + the featured areas linked from the homepage (always present).
export const dynamicParams = false;
export const generateStaticParams = () => allAreas().map((a) => ({ area: a.slug }));

type Props = { params: Promise<{ area: string }> };

const findArea = (slug: string) => allAreas().find((a) => a.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const a = findArea(area);
  if (!a) return {};
  const title = `${a.name} | ${site.name}`;
  const description = `Properties for sale and rent in ${a.name}, Dubai — browse the latest listings from ${site.name}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/area/${a.slug}/` },
    openGraph: { title, description, url: `/area/${a.slug}/` },
  };
}

export default async function AreaPage({ params }: Props) {
  const { area } = await params;
  const a = findArea(area);
  if (!a) notFound();
  return <ListingArchive title={a.name} listings={propertiesInArea(a.slug)} search={{ location: a.name }} />;
}
