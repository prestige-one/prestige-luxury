import type { Metadata } from "next";
import SearchResults from "@/components/listings/SearchResultsPage";
import { getPage, seoMetadata } from "@/lib/content";

const page = getPage("/search-results/");
export const metadata: Metadata = {
  ...(page ? seoMetadata(page) : { title: "Search Results" }),
  // Filtered result pages should not compete with the archive pages in search engines
  robots: { index: false, follow: true },
};

export default function SearchResultsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <SearchResults searchParams={searchParams} title="Search Results" />;
}
