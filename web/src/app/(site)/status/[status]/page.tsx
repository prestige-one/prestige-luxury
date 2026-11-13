import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingArchive from "@/components/listings/ListingArchive";
import { statuses } from "@/lib/listing-format";
import { searchProperties } from "@/lib/properties";
import { site } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => statuses.map((s) => ({ status: s.slug }));

type Props = { params: Promise<{ status: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { status } = await params;
  const s = statuses.find((x) => x.slug === status);
  if (!s) return {};
  const title = `${s.label} | ${site.name}`;
  const description = `Properties ${s.label.toLowerCase()} in Dubai — apartments, villas, townhouses and more from ${site.name}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/status/${s.slug}/` },
    openGraph: { title, description, url: `/status/${s.slug}/` },
  };
}

export default async function StatusPage({ params }: Props) {
  const { status } = await params;
  const s = statuses.find((x) => x.slug === status);
  if (!s) notFound();
  return <ListingArchive title={s.label} listings={searchProperties({ status: s.slug })} />;
}
