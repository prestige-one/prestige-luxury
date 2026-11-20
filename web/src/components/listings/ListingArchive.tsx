import { Container } from "@/components/ui";
import { type Property } from "@/lib/properties";
import { areaOptions, cityOptions, locationOptions, searchTypeOptions } from "@/lib/listing-views";
import { ViewToggle } from "./ListingResults";
import ListingSearchBar, { type SearchBarValues } from "./ListingSearchBar";
import ListingCollection, { type RawParams } from "./ListingCollection";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export type { RawParams } from "./ListingCollection";

/**
 * Shared full-width listing archive with search, sort, pagination and a three-column grid.
 *
 * Sorting and paging live in the query string (`?sort=`, `?page=`) and are applied here, on
 * the server, so a result can be shared and only the twelve cards of the current page are
 * ever rendered into the HTML.
 */
export default function ListingArchive({
  title,
  listings,
  intro,
  search,
  path,
  searchParams = {},
  emptyState,
}: {
  title: string;
  listings: Property[];
  intro?: React.ReactNode;
  search?: SearchBarValues;
  /** This archive's own URL, e.g. "/status/for-rent/" — sort and page links are built from it. */
  path: string;
  searchParams?: RawParams;
  emptyState?: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: title, path }]} />
      {/* Remount the search row when the page's own filters change, but not when only sort/page do. */}
      <ListingSearchBar key={JSON.stringify(search ?? {})} cities={cityOptions()} areas={areaOptions()} locations={locationOptions()} types={searchTypeOptions()} initial={search} />
      <Container className="pb-[90px] pt-8">
        <div className="mt-3 mb-8 flex items-end justify-between gap-4">
          <h1 className="text-[30px] font-medium leading-tight text-ink md:text-[36px]">{title}</h1>
          <ViewToggle />
        </div>
        {intro}
        <ListingCollection listings={listings} path={path} searchParams={searchParams} emptyState={emptyState} />
      </Container>
    </>
  );
}
