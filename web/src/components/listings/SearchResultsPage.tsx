import ListingArchive from "./ListingArchive";
import { statusLabel } from "@/lib/listing-format";
import { filterListings, parseFilters } from "@/lib/listing-views";

type SP = Record<string, string | string[] | undefined>;

/** Shared body of /search-results/ and /advanced-search-results/ (filters come from the query string). */
export default async function SearchResultsPage({ searchParams, title }: { searchParams: Promise<SP>; title: string }) {
  const filters = parseFilters(await searchParams);
  const { sort, ...search } = filters;
  const listings = filterListings(filters);

  const summary = [
    filters.status && statusLabel(filters.status),
    filters.type,
    filters.beds && (filters.beds === "0" ? "Studio" : filters.beds === "5" ? "5+ Beds" : `${filters.beds} Beds`),
    filters.location,
    filters.city,
    filters.maxPrice && `Up to AED ${new Intl.NumberFormat("en-AE").format(Number(filters.maxPrice))}`,
    filters.q && `“${filters.q}”`,
  ].filter(Boolean);

  return (
    <ListingArchive
      title={title}
      listings={listings}
      search={search}
      initialSort={sort}
      syncUrl
      intro={summary.length ? <p className="-mt-4 mb-8 text-[14px] text-muted">Showing results for: {summary.join(" · ")}</p> : undefined}
    />
  );
}
