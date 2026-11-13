import type { Metadata } from "next";
import DeveloperDirectory from "@/components/developers/DeveloperDirectory";
import type { DeveloperCardData } from "@/components/developers/shared";
import { Breadcrumb, Container, PageBanner } from "@/components/ui";
import { developerExcerpt, developers } from "@/lib/developers";
import { site } from "@/lib/site";

const title = `Real Estate Developers in Dubai | ${site.name}`;
const description =
  "A directory of Dubai's real estate developers — their story, signature projects, the communities they build in and the properties available with Prestige Luxury Real Estate.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/developers/" },
  openGraph: { title, description, url: "/developers/" },
};

// Only what a card shows: the full developer records stay on the server.
const cards: DeveloperCardData[] = developers.map((d) => ({
  slug: d.slug,
  name: d.name,
  legalName: d.legalName,
  status: d.status,
  featured: d.featured,
  tagline: d.tagline,
  summary: developerExcerpt(d),
}));

export default function DevelopersPage() {
  return (
    <>
      <PageBanner
        title="Real Estate Developers in Dubai"
        subtitle="The master developers and boutique names behind the city's addresses."
        image="/wp-content/uploads/2020/02/bg-bw.jpg"
      />

      <Container className="pb-[90px] pt-8">
        <Breadcrumb items={[{ label: "Developers" }]} />

        <div className="mx-auto mb-10 mt-6 max-w-[760px] text-center text-[15px] leading-[1.8] text-body md:mb-12">
          <p>
            Dubai’s skyline is the work of a few dozen developers, from the master developers who plan whole communities to the boutique
            names behind a single landmark tower. Browse them below to see what each one is known for, where they build, and which of their
            properties we currently have available.
          </p>
        </div>

        <DeveloperDirectory developers={cards} />
      </Container>
    </>
  );
}
