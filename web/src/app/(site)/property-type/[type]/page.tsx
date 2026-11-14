import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingArchive, { type RawParams } from "@/components/listings/ListingArchive";
import { propertiesOfType, typeRoutes } from "@/lib/listing-views";
import { site } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => typeRoutes.map((t) => ({ type: t.slug }));

type Props = { params: Promise<{ type: string }>; searchParams: Promise<RawParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const t = typeRoutes.find((x) => x.slug === type);
  if (!t) return {};
  const title = `${t.label} | ${site.name}`;
  const description = `${t.label} properties for sale and rent in Dubai from ${site.name}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/property-type/${t.slug}/` },
    openGraph: { title, description, url: `/property-type/${t.slug}/` },
  };
}

export default async function PropertyTypePage({ params, searchParams }: Props) {
  const { type } = await params;
  const t = typeRoutes.find((x) => x.slug === type);
  if (!t) notFound();
  return (
    <ListingArchive
      title={t.label}
      path={`/property-type/${t.slug}/`}
      listings={propertiesOfType(t.slug)}
      search={{ type: t.slug === "apartments" ? "Apartment" : t.label }}
      searchParams={await searchParams}
    />
  );
}
