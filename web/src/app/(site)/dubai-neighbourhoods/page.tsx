// Keep the original neighbourhood guide and destinations, using the homepage's shared area cards.
import type { Metadata } from "next";
import { Container, PageBanner } from "@/components/ui";
import AreaCard from "@/components/areas/AreaCard";
import AreaSelect from "@/components/guides/AreaSelect";
import { getPage, seoMetadata } from "@/lib/content";
import { communities, communityImages } from "@/lib/community-content";

const page = getPage("/dubai-neighbourhoods/")!;
export const metadata: Metadata = {
  ...seoMetadata(page),
  // The stored Yoast description is the page's raw text (incl. a shortcode); use the intro sentence instead.
  description: "This guide breaks down some of the most frequented Dubai neighborhoods so you can experience the real Dubai and get a feel for how these enclaves flavor the city.",
};

// Curated guide order; community photography is stored locally.
const areas: { slug: string; name: string }[] = [
  { slug: "dubai-marina", name: "Dubai Marina" },
  { slug: "palm-jumeirah", name: "Palm Jumeirah" },
  { slug: "downtown-dubai", name: "Downtown Dubai" },
  { slug: "business-bay", name: "Business Bay" },
  { slug: "jumeirah-beach-residence", name: "Jumeirah Beach Residence" },
  { slug: "jumeirah-lake-towers", name: "Jumeirah Lake Towers" },
  { slug: "jumeirah-village-circle", name: "Jumeirah Village Circle" },
  { slug: "al-furjan", name: "Al Furjan" },
  { slug: "dubai-sports-city", name: "Dubai Sports City" },
  { slug: "mohammed-bin-rashid-city", name: "Mohammed Bin Rashid City" },
  { slug: "the-hills", name: "The Hills" },
  { slug: "damac-hills-2", name: "Damac Hills 2" },
  { slug: "dubai-harbour", name: "Dubai Harbour" },
  { slug: "meydan", name: "Meydan" },
  { slug: "emaar-beachfront-2", name: "EMAAR Beachfront" },
  { slug: "dubai-creek-harbour", name: "Dubai Creek Harbour" },
  { slug: "dubai-hills-estate", name: "Dubai Hills Estate" },
  { slug: "dubai-south", name: "Dubai South" },
  { slug: "al-sufouh", name: "Al Sufouh" },
  { slug: "damac-lagoons", name: "DAMAC Lagoons" },
  { slug: "maritime-city", name: "Maritime City" },
  { slug: "dubai-land", name: "Dubai Land" },
  { slug: "damac-hills-akoya-by-damac", name: "DAMAC Hills (Akoya By DAMAC)" },
  { slug: "akoya-oxygen", name: "Akoya Oxygen" },
  { slug: "the-greens", name: "The Greens" },
  { slug: "dubai-silicon-oasis", name: "Dubai Silicon Oasis" },
  { slug: "the-views", name: "The Views" },
  { slug: "dubai-production-city-impz", name: "Dubai Production City (IMPZ)" },
  { slug: "jebel-ali", name: "Jebel Ali" },
  { slug: "jumeirah-park", name: "Jumeirah Park" },
  { slug: "mina-rashid", name: "Mina Rashid" },
  { slug: "difc", name: "DIFC" },
  { slug: "arabian-ranches", name: "Arabian Ranches" },
  { slug: "arabian-ranches-2", name: "Arabian Ranches 2" },
  { slug: "green-community", name: "Green Community" },
  { slug: "jumeirah-village-triangle", name: "Jumeirah Village Triangle" },
  { slug: "al-habtoor-city", name: "Al Habtoor City" },
  { slug: "umm-suqeim", name: "Umm Suqeim" },
  { slug: "the-springs", name: "The Springs" },
  { slug: "discovery-gardens", name: "Discovery Gardens" },
  { slug: "nadd-al-sheba", name: "Nadd Al Sheba" },
  { slug: "al-jaddaf", name: "Al Jaddaf" },
  { slug: "barsha-heights-tecom", name: "Barsha Heights (Tecom)" },
];

const communityBySlug = new Map(communities.map((community) => [community.slug, community]));
const communityAliases: Record<string, string> = {
  "maritime-city": "dubai-maritime-city",
  meydan: "meydan-horizon",
};
// Landscape originals need a wider image candidate to stay sharp when cropped to tall cards.
const neighbourhoods = areas.map((area) => {
  const community = communityBySlug.get(communityAliases[area.slug] ?? area.slug);
  return {
    ...area,
    image: communityImages[area.slug],
    text: community?.description ?? `Explore properties in ${area.name} and find a home that suits your lifestyle, priorities and investment plans.`,
  };
});

export default function DubaiNeighbourhoodsPage() {
  return (
    <>
      <PageBanner
        title="Popular Dubai Neighbourhoods"
        subtitle="This guide breaks down some of the most frequented Dubai neighborhoods so you can experience the real Dubai and get a feel for how these enclaves flavor the city."
        image="/images/faq-dubai-skyline-4k.webp"
        imageQuality={85}
        imageClassName="opacity-80 object-[center_75%]"
      />

      <section className="pl-neighbourhoods bg-mist pb-20 pt-[30px]">
        <Container>
          <div className="my-[30px]">
            <AreaSelect areas={areas.map((a) => ({ name: a.name, href: `/area/${a.slug}/` }))} />
          </div>

          <ul className="pl-neighbourhood-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {neighbourhoods.map((area) => (
              <li key={area.slug}>
                <AreaCard title={area.name} text={area.text} image={area.image} imageSizes="800px" imageQuality={85} href={`/area/${area.slug}/`} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
