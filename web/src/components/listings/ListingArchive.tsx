import { Container } from "@/components/ui";
import { type Property } from "@/lib/properties";
import { countLabel, PAGE_SIZE, pageCount, parsePage, parseSort, sortOptions, sortProperties, type SortKey } from "@/lib/listing-format";
import { areaOptions, cityOptions, locationOptions, searchTypeOptions } from "@/lib/listing-views";
import { ResultsGrid, SortSelect, ViewToggle } from "./ListingResults";
import ListingSearchBar, { type SearchBarValues } from "./ListingSearchBar";
import Pagination from "./Pagination";
import PropertyCard from "./PropertyCard";

export type RawParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Keeps the page's own filters in the URL and replaces only `sort`/`page`. */
function buildHref(path: string, params: RawParams, next: { sort?: SortKey; page?: number }) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const s = one(v);
    if (s && k !== "sort" && k !== "page") q.set(k, s);
  }
  if (next.sort && next.sort !== "default") q.set("sort", next.sort);
  if (next.page && next.page > 1) q.set("page", String(next.page));
  const query = q.toString();
  return query ? `${path}?${query}` : path;
}

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
}: {
  title: string;
  listings: Property[];
  intro?: React.ReactNode;
  search?: SearchBarValues;
  /** This archive's own URL, e.g. "/status/for-rent/" — sort and page links are built from it. */
  path: string;
  searchParams?: RawParams;
}) {
  const sort = parseSort(one(searchParams.sort));
  const page = parsePage(one(searchParams.page), listings.length);
  const pages = pageCount(listings.length);
  const shown = sortProperties(listings, sort).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const href = (next: { sort?: SortKey; page?: number }) => buildHref(path, searchParams, next);
  const sortHrefs = Object.fromEntries(sortOptions.map((o) => [o.value, href({ sort: o.value })])) as Record<SortKey, string>;

  return (
    <>
      {/* Remount the search row when the page's own filters change, but not when only sort/page do. */}
      <ListingSearchBar key={JSON.stringify(search ?? {})} cities={cityOptions()} areas={areaOptions()} locations={locationOptions()} types={searchTypeOptions()} initial={search} />
      <Container className="pb-[90px] pt-8">
        <div className="mt-3 mb-8 flex items-end justify-between gap-4">
          <h1 className="text-[30px] font-medium leading-tight text-ink md:text-[36px]">{title}</h1>
          <ViewToggle />
        </div>
        {intro}
        <div>
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] font-medium text-ink">
                {countLabel(listings.length)}
                {pages > 1 && <span className="font-normal text-muted"> · Page {page} of {pages}</span>}
              </p>
              <SortSelect sort={sort} hrefs={sortHrefs} />
            </div>

            {shown.length === 0 ? (
              <p className="border border-line bg-mist px-6 py-16 text-center text-[16px] text-muted">No listing found.</p>
            ) : (
              <ResultsGrid>
                {shown.map((p, i) => (
                  <div key={p.id}>
                    <PropertyCard property={p} priority={i < 3} />
                  </div>
                ))}
              </ResultsGrid>
            )}

            <Pagination page={page} pages={pages} href={(n) => href({ sort, page: n })} />
          </div>
        </div>
      </Container>
    </>
  );
}
