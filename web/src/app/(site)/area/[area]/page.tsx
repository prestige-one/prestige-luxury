import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Media from "@/components/Media";
import { Container } from "@/components/ui";
import AreaPropertyFilters from "@/components/areas/AreaPropertyFilters";
import ListingCollection, { listingHref, type RawParams } from "@/components/listings/ListingCollection";
import { ViewToggle } from "@/components/listings/ListingResults";
import { allAreas, filterListings, parseFilters, propertiesInArea, searchTypeOptions } from "@/lib/listing-views";
import { sizedImage } from "@/lib/listing-format";
import { site } from "@/lib/site";
import { areaOverview } from "@/lib/area-overviews";
import { communities, communityImages } from "@/lib/community-content";

// Every community with listings + the featured areas linked from the homepage (always present).
export const dynamicParams = false;
export const generateStaticParams = () => allAreas().map((a) => ({ area: a.slug }));

type Props = { params: Promise<{ area: string }>; searchParams: Promise<RawParams> };

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

export default async function AreaPage({ params, searchParams }: Props) {
  const { area } = await params;
  const a = findArea(area);
  if (!a) notFound();
  const paramsQuery = await searchParams;
  const filters = parseFilters(paramsQuery);
  const listings = propertiesInArea(a.slug);
  const ready = listings.filter((property) => property.completion !== "off-plan");
  const saleCount = ready.filter((property) => property.purpose === "sale").length;
  const rentCount = ready.length - saleCount;
  const projects = listings.filter((property) => property.completion === "off-plan");
  const status = filters.status === "for-rent" && rentCount ? "for-rent" : saleCount ? "for-sale" : rentCount ? "for-rent" : "off-plan";
  // The area is fixed by the route, never by a mutable CRM field or an arbitrary query.
  const search = { q: filters.q, type: filters.type, beds: filters.beds, maxPrice: filters.maxPrice };
  const matches = filterListings({ ...search, status }, ready);
  const path = `/area/${a.slug}/`;
  const aliases: Record<string, string> = { "maritime-city": "dubai-maritime-city", meydan: "meydan-horizon" };
  const community = communities.find((community) => community.slug === (aliases[a.slug] ?? a.slug));
  const image = communityImages[a.slug] ?? community?.image ?? (listings[0]?.images[0] ? sizedImage(listings[0].images[0], "full") : site.ctaImage);
  const description = community?.description ?? `Explore properties in ${a.name} and find a home that suits your lifestyle, priorities and investment plans.`;
  const overview = areaOverview(a.slug, a.name, description, listings);
  const formKey = JSON.stringify({ ...search, status });
  const tabHref = (status: string) => listingHref(path, paramsQuery, { status, page: undefined, maxPrice: undefined }, "pl-area-properties");

  return <div className="pl-area-detail bg-white">
    <section className="pl-area-hero relative isolate flex min-h-[470px] items-end overflow-hidden bg-black md:min-h-[540px]">
      <Media src={image} alt={`${a.name}, Dubai`} fill preload sizes="100vw" quality={85} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15" aria-hidden />
      <Container className="relative py-12 md:pb-14 md:pt-24">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80">Dubai neighbourhoods</p>
        <h1 className="max-w-[900px] text-[34px] font-normal leading-[1.15] tracking-[-0.025em] text-white sm:text-[44px] md:text-[54px]">{a.name}</h1>
        <p className="mt-5 max-w-[780px] text-[14px] leading-[1.8] text-white/90 md:text-[16px]">{description}</p>
      </Container>
    </section>

    <Container className="py-12 md:py-16">
      <div className="pl-area-overview border-b border-line pb-12 md:pb-16">
        <div className="text-center"><p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">About {a.name}</p><h2 className="mt-4 text-[23px] font-normal leading-snug text-ink">Find your place in {a.name}</h2></div>
        <div className="pl-area-overview-copy mt-6 space-y-5 text-[15px] leading-[1.9] text-muted">{overview.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <p className="mt-7 text-[14px] leading-[1.8] text-muted"><Link href="/contact-us/" className="text-ink underline underline-offset-4 hover:opacity-65">Speak to our property specialists</Link> for help finding the right property.</p>
      </div>
    </Container>

    {ready.length > 0 && <section id="pl-area-properties" className="pl-area-properties scroll-mt-28 pb-16 md:pb-20" aria-labelledby="pl-area-property-title">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4"><h2 id="pl-area-property-title" className="text-[25px] font-normal leading-snug tracking-[-0.02em] text-ink">Properties for {status === "for-rent" ? "rent" : "sale"} in {a.name}</h2><ViewToggle /></div>
        <nav aria-label="Property purpose" className="mb-6 flex gap-3">
          {[{ status: "for-sale", label: "For Sale", count: saleCount }, { status: "for-rent", label: "For Rent", count: rentCount }].filter((tab) => tab.count > 0).map((tab) => <Link key={tab.status} href={tabHref(tab.status)} aria-current={status === tab.status ? "page" : undefined} className={`rounded-[3px] border px-5 py-3 text-[13px] font-medium transition-colors ${status === tab.status ? "border-black bg-black text-white" : "border-line bg-white text-ink hover:border-black"}`}>{tab.label}<span className={`ml-2 ${status === tab.status ? "text-white/70" : "text-muted"}`}>({tab.count})</span></Link>)}
        </nav>
        <AreaPropertyFilters key={`results-${formKey}`} path={path} name={a.name} status={status} initial={search} types={searchTypeOptions(ready)} />
        <ListingCollection listings={matches} path={path} searchParams={paramsQuery} anchor="pl-area-properties" alwaysShowPage priority={false} emptyState={<div className="rounded-[6px] bg-mist px-6 py-14 text-center"><h3 className="text-[20px] text-ink">No properties match these filters</h3><p className="mt-3 text-[14px] text-muted">Try another keyword, property type or budget.</p><Link href={`${path}?status=${status}#pl-area-properties`} className="mt-5 inline-block text-[14px] underline underline-offset-4">Clear filters</Link></div>} />
      </Container>
    </section>}

    {projects.length > 0 && <section id="pl-area-projects" className="pl-area-projects scroll-mt-28 border-t border-line bg-mist py-14 md:py-20" aria-labelledby="pl-area-project-title">
      <Container>
        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted">A new perspective</p>
        <div className="mb-6 flex items-end justify-between gap-4"><h2 id="pl-area-project-title" className="text-[25px] font-normal leading-snug tracking-[-0.02em] text-ink">Off-plan properties in {a.name}</h2><ViewToggle /></div>
        {status === "off-plan" && <AreaPropertyFilters key={`projects-${formKey}`} path={path} name={a.name} status={status} initial={search} types={searchTypeOptions(projects)} />}
        <ListingCollection listings={status === "off-plan" ? filterListings({ ...search, status: "off-plan" }, projects) : projects} path={path} searchParams={paramsQuery} pageKey="projectPage" sortKey="projectSort" anchor="pl-area-projects" alwaysShowPage priority={false} />
      </Container>
    </section>}

    {listings.length === 0 && <Container className="pb-20 text-center"><h2 className="text-[25px] text-ink">Properties in {a.name}</h2><p className="mt-4 text-[15px] text-muted">There are no available listings in this area at the moment.</p><Link href="/contact-us/" className="mt-6 inline-flex min-h-12 items-center rounded-[3px] bg-black px-7 text-[14px] text-white hover:opacity-75">Speak to a property specialist</Link></Container>}
  </div>;
}
