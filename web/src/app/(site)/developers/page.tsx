import type { Metadata } from "next";
import DeveloperDirectory from "@/components/developers/DeveloperDirectory";
import DeveloperLogoSlider from "@/components/developers/DeveloperLogoSlider";
import type { DeveloperCardData } from "@/components/developers/shared";
import { Container, PageBanner } from "@/components/ui";
import { developerLogo, developerLogoClass } from "@/lib/developer-logos";
import { developerCardImage } from "@/lib/developer-imagery";
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
const cards: DeveloperCardData[] = developers.map((d) => {
  const image = developerCardImage(d);
  return {
    slug: d.slug,
    name: d.name,
    legalName: d.legalName,
    featured: d.featured,
    summary: developerExcerpt(d, 240) || d.tagline,
    logo: developerLogo(d.slug),
    logoClassName: developerLogoClass(d.slug),
    image: image.src,
    imageAlt: image.alt,
  };
});

export default function DevelopersPage() {
  return (
    <>
      <PageBanner
        title="Real Estate Developers in Dubai"
        subtitle="The master developers and boutique names behind the city's addresses."
        image="/wp-content/uploads/2020/02/bg-bw.jpg"
      />
      <DeveloperLogoSlider />

      <Container className="pt-8">
        <div className="mx-auto mb-10 mt-6 max-w-[760px] text-center text-[15px] leading-[1.8] text-body md:mb-12">
          <p>
            Dubai’s skyline is the work of a few dozen developers, from the master developers who plan whole communities to the boutique
            names behind a single landmark tower. Browse them below to see what each one is known for, where they build, and which of their
            properties we currently have available.
          </p>
        </div>

      </Container>
      <div className="mx-auto max-w-[1440px] px-5 pb-[90px] lg:px-10">
        <DeveloperDirectory developers={cards} />
      </div>
    </>
  );
}
