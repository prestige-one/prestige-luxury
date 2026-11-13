import type { Metadata } from "next";
import SearchResults from "@/components/listings/SearchResultsPage";
import { getPage, seoMetadata } from "@/lib/content";

const page = getPage("/advanced-search-results/");
export const metadata: Metadata = {
  ...(page ? seoMetadata(page) : { title: "Advanced Search Results" }),
  // Filtered result pages should not compete with the archive pages in search engines
  robots: { index: false, follow: true },
};

export default function AdvancedSearchResultsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <SearchResults searchParams={searchParams} title="Advanced Search Results" />;
}
