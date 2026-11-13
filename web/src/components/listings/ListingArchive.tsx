import { Breadcrumb, Container } from "@/components/ui";
import { propertyTypes, type Property } from "@/lib/properties";
import type { SortKey } from "@/lib/listing-format";
import { areaOptions, cityOptions } from "@/lib/listing-views";
import ListingResults, { ListingViewProvider, ViewToggle } from "./ListingResults";
import ListingSearchBar, { type SearchBarValues } from "./ListingSearchBar";
import ListingSidebar from "./ListingSidebar";
import PropertyCard from "./PropertyCard";

/**
 * The Houzez listing archive: search row, breadcrumb, title, count + sort, list/grid toggle,
 * results on the left and the sidebar on the right.
 */
export default function ListingArchive({
  title,
  crumbs,
  listings,
  intro,
  search,
  initialSort,
  syncUrl = false,
}: {
  title: string;
  crumbs?: { label: string; href?: string }[];
  listings: Property[];
  intro?: React.ReactNode;
  search?: SearchBarValues;
  initialSort?: SortKey;
  syncUrl?: boolean;
}) {
  const items = listings.map((p, i) => ({
    id: p.id,
    price: p.price,
    listedAt: p.listedAt,
    updatedAt: p.updatedAt,
    card: <PropertyCard property={p} priority={i < 2} />,
  }));
  // Reset sort/page/search fields when the filters change (navigating between searches)
  const stateKey = JSON.stringify([search ?? {}, initialSort ?? "default"]);

  return (
    <>
      <ListingSearchBar key={stateKey} cities={cityOptions()} areas={areaOptions()} types={propertyTypes} initial={search} />
      <ListingViewProvider>
        <Container className="pb-[90px] pt-8">
          <Breadcrumb items={crumbs ?? [{ label: title }]} />
          <div className="mt-3 mb-8 flex items-end justify-between gap-4">
            <h1 className="text-[30px] font-medium leading-tight text-ink md:text-[36px]">{title}</h1>
            <ViewToggle />
          </div>
          {intro}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">
            <ListingResults key={stateKey} items={items} initialSort={initialSort} syncUrl={syncUrl} />
            <ListingSidebar />
          </div>
        </Container>
      </ListingViewProvider>
    </>
  );
}
