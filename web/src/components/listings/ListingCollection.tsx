import type { ReactNode } from "react";
import type { Property } from "@/lib/properties";
import { countLabel, PAGE_SIZE, pageCount, parsePage, parseSort, sortOptions, sortProperties, type SortKey } from "@/lib/listing-format";
import { ResultsGrid, SortSelect } from "./ListingResults";
import Pagination from "./Pagination";
import PropertyCard from "./PropertyCard";

export type RawParams = Record<string, string | string[] | undefined>;
export const queryValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

/** Preserve unrelated filters and independently paged collections on the same page. */
export function listingHref(path: string, params: RawParams, changes: Record<string, string | undefined>, anchor = "") {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...params, ...changes })) {
    const text = queryValue(value);
    if (text) query.set(key, text);
  }
  return `${path}${query.size ? `?${query}` : ""}${anchor ? `#${anchor}` : ""}`;
}

/** Server-side sorting/paging: only this collection's current twelve cards reach the client. */
export default function ListingCollection({ listings, path, searchParams = {}, pageKey = "page", sortKey = "sort", anchor, alwaysShowPage = false, priority = true, emptyState }: {
  listings: Property[];
  path: string;
  searchParams?: RawParams;
  pageKey?: string;
  sortKey?: string;
  anchor?: string;
  alwaysShowPage?: boolean;
  priority?: boolean;
  emptyState?: ReactNode;
}) {
  const sort = parseSort(queryValue(searchParams[sortKey]));
  const page = parsePage(queryValue(searchParams[pageKey]), listings.length);
  const pages = pageCount(listings.length);
  const shown = sortProperties(listings, sort).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const href = (sort: SortKey, page?: number) => listingHref(path, searchParams, {
    [sortKey]: sort === "default" ? undefined : sort,
    [pageKey]: page && page > 1 ? String(page) : undefined,
  }, anchor);
  const sortHrefs = Object.fromEntries(sortOptions.map((option) => [option.value, href(option.value)])) as Record<SortKey, string>;

  return <div className="pl-listing-collection">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[15px] font-medium text-ink" role="status">
        {countLabel(listings.length)}
        {(alwaysShowPage || pages > 1) && <span className="font-normal text-muted"> · Page {page} of {pages}</span>}
      </p>
      <SortSelect sort={sort} hrefs={sortHrefs} />
    </div>
    {shown.length ? <ResultsGrid>
      {shown.map((property, index) => <div key={property.id}><PropertyCard property={property} priority={priority && index < 3} /></div>)}
    </ResultsGrid> : emptyState ?? <p className="border border-line bg-mist px-6 py-16 text-center text-[16px] text-muted">No listing found.</p>}
    <Pagination page={page} pages={pages} href={(next) => href(sort, next)} />
  </div>;
}
