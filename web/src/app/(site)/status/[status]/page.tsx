import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingArchive, { type RawParams } from "@/components/listings/ListingArchive";
import { statuses } from "@/lib/listing-format";
import { searchProperties } from "@/lib/properties";
import { site } from "@/lib/site";
import { pageTitles } from "@/lib/page-seo";

export const dynamicParams = false;
export const generateStaticParams = () => statuses.map((s) => ({ status: s.slug }));

type Props = { params: Promise<{ status: string }>; searchParams: Promise<RawParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { status } = await params;
  const s = statuses.find((x) => x.slug === status);
  if (!s) return {};
  const title = pageTitles[`/status/${s.slug}/`] || `${s.label} | ${site.name}`;
  const description = `Properties ${s.label.toLowerCase()} in Dubai — apartments, villas, townhouses and more from ${site.name}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/status/${s.slug}/` },
    openGraph: { title, description, url: `/status/${s.slug}/` },
    twitter: { title, description },
  };
}

export default async function StatusPage({ params, searchParams }: Props) {
  const { status } = await params;
  const s = statuses.find((x) => x.slug === status);
  if (!s) notFound();
  return (
    <ListingArchive
      title={s.label}
      path={`/status/${s.slug}/`}
      listings={searchProperties({ status: s.slug })}
      search={{ status: s.slug }}
      searchParams={await searchParams}
    />
  );
}
