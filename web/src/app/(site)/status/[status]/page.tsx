import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingArchive, { type RawParams } from "@/components/listings/ListingArchive";
import { statuses } from "@/lib/listing-format";
import { filterListings, parseFilters } from "@/lib/listing-views";
import { Button } from "@/components/ui";
import { site } from "@/lib/site";
import { pageTitles } from "@/lib/page-seo";

export const dynamicParams = false;
export const generateStaticParams = () => statuses.map((s) => ({ status: s.slug }));

type Props = { params: Promise<{ status: string }>; searchParams: Promise<RawParams> };
const offPlanTypeLabels: Record<string, string> = { Apartment: "Apartments", Villa: "Villas", Townhouse: "Townhouses", Penthouse: "Penthouses", Mansion: "Mansions", "Other Commercial": "Commercial Properties" };

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
  const query = await searchParams;
  const filters = parseFilters({ ...query, status: s.slug });
  const offPlan = s.slug === "off-plan";
  const title = offPlan ? `Off-Plan ${filters.type ? offPlanTypeLabels[filters.type] ?? filters.type : "Projects"}` : s.label;
  return (
    <ListingArchive
      title={title}
      path={`/status/${s.slug}/`}
      listings={filterListings(filters)}
      search={filters}
      searchParams={query}
      emptyState={offPlan ? <div className="pl-projects-empty border border-line bg-mist px-6 py-12 text-center">
        <h2 className="text-[20px] font-medium text-ink">No matching off-plan properties are currently listed</h2>
        <p className="mx-auto mt-3 max-w-[520px] text-[14px] leading-[1.8] text-muted">Explore the full collection or speak to our team about your preferred property type and upcoming opportunities.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Button href="/status/off-plan/">View All Projects</Button><Button href="/contact-us/" variant="outline">Speak to an Advisor</Button></div>
      </div> : undefined}
    />
  );
}
