import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingArchive, { type RawParams } from "@/components/listings/ListingArchive";
import { filterListings, parseFilters, propertiesOfType, typeRoutes } from "@/lib/listing-views";
import { statusLabel } from "@/lib/listing-format";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => typeRoutes.map((t) => ({ type: t.slug }));

type Props = { params: Promise<{ type: string }>; searchParams: Promise<RawParams> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { type } = await params;
  const t = typeRoutes.find((x) => x.slug === type);
  if (!t) return {};
  const title = `${t.label} | ${site.name}`;
  const description = `${t.label} properties for sale and rent in Dubai from ${site.name}.`;
  const query = await searchParams;
  const filters = parseFilters(query);
  const count = propertiesOfType(t.slug, filterListings({ ...filters, type: undefined })).length;
  return pageMetadata({ title, description, path: `/property-type/${t.slug}/`,
    pagination: [{ key: "page", value: query.page, total: count }] });
}

export default async function PropertyTypePage({ params, searchParams }: Props) {
  const { type } = await params;
  const t = typeRoutes.find((x) => x.slug === type);
  if (!t) notFound();
  const query = await searchParams;
  const filters = parseFilters(query);
  const label = filters.status && statusLabel(filters.status);
  return (
    <ListingArchive
      title={label ? `${t.label} · ${label}` : t.label}
      path={`/property-type/${t.slug}/`}
      listings={propertiesOfType(t.slug, filterListings({ ...filters, type: undefined }))}
      search={{ ...filters, type: t.slug === "apartments" ? "Apartment" : t.label }}
      searchParams={query}
    />
  );
}
