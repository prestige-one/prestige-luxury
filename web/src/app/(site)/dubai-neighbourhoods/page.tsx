// Keep the original neighbourhood guide and destinations, using the homepage's shared area cards.
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import AreaCard from "@/components/areas/AreaCard";
import AreaSelect from "@/components/guides/AreaSelect";
import { getPage, seoMetadata } from "@/lib/content";
import { communityPhoto } from "@/lib/imagery";
import communities from "../../../../content/communities.json";

const page = getPage("/dubai-neighbourhoods/")!;
export const metadata: Metadata = {
  ...seoMetadata(page),
  // The stored Yoast description is the page's raw text (incl. a shortcode); use the intro sentence instead.
  description: "This guide breaks down some of the most frequented Dubai neighborhoods so you can experience the real Dubai and get a feel for how these enclaves flavor the city.",
};

// Areas in the order of the original grid. Photos are the site's own uploads (the original tiles had none).
const areas: { slug: string; name: string; image?: string }[] = [
  { slug: "dubai-marina", name: "Dubai Marina", image: "/wp-content/uploads/2020/07/Dubai-Marina-2.jpg" },
  { slug: "palm-jumeirah", name: "Palm Jumeirah", image: "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg" },
  {
    slug: "downtown-dubai",
    name: "Downtown Dubai",
    image: "/wp-content/uploads/2024/04/Address-Downtown-Downtown-Dubai-Downtown-Dubai-ADM240062-Prestige-Luxury-Real-Estate-30-1170x785.jpg",
  },
  { slug: "business-bay", name: "Business Bay", image: "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg" },
  { slug: "jumeirah-beach-residence", name: "Jumeirah Beach Residence", image: "/wp-content/uploads/2019/07/jbr-beach-2048x1271.jpg" },
  { slug: "jumeirah-lake-towers", name: "Jumeirah Lake Towers", image: "/wp-content/uploads/2019/06/jlt-apartments.jpg" },
  { slug: "jumeirah-village-circle", name: "Jumeirah Village Circle", image: "/wp-content/uploads/2019/05/jumeirah-village-circle.jpg" },
  { slug: "al-furjan", name: "Al Furjan" },
  { slug: "dubai-sports-city", name: "Dubai Sports City" },
  { slug: "mohammed-bin-rashid-city", name: "Mohammed Bin Rashid City", image: "/wp-content/uploads/2019/05/mbr-city-dubai.jpg" },
  { slug: "the-hills", name: "The Hills" },
  { slug: "damac-hills-2", name: "Damac Hills 2" },
  { slug: "dubai-harbour", name: "Dubai Harbour", image: "/wp-content/uploads/2020/02/dubai-harbour-project.jpg" },
  { slug: "difc", name: "DIFC" },
  { slug: "meydan", name: "Meydan" },
  { slug: "emaar-beachfront-2", name: "EMAAR Beachfront" },
  { slug: "dubai-creek-harbour", name: "Dubai Creek Harbour" },
  { slug: "dubai-hills-estate", name: "Dubai Hills Estate" },
  { slug: "dubai-south", name: "Dubai South" },
  { slug: "al-sufouh", name: "Al Sufouh" },
  { slug: "damac-lagoons", name: "DAMAC Lagoons" },
  { slug: "maritime-city", name: "Maritime City" },
  { slug: "dubai-land", name: "Dubai Land" },
  { slug: "deira", name: "Deira", image: "/wp-content/uploads/2019/08/deira-city-center.jpg" },
  { slug: "damac-hills-akoya-by-damac", name: "DAMAC Hills (Akoya By DAMAC)" },
  { slug: "akoya-oxygen", name: "Akoya Oxygen" },
  { slug: "the-greens", name: "The Greens" },
  { slug: "dubai-silicon-oasis", name: "Dubai Silicon Oasis" },
  { slug: "the-views", name: "The Views" },
  { slug: "dubai-production-city-impz", name: "Dubai Production City (IMPZ)" },
  { slug: "jebel-ali", name: "Jebel Ali" },
  { slug: "jumeirah-park", name: "Jumeirah Park" },
  { slug: "mina-rashid", name: "Mina Rashid", image: "/wp-content/uploads/2019/06/mina-rashid-apartments.jpg" },
  { slug: "arabian-ranches", name: "Arabian Ranches", image: "/wp-content/uploads/2019/10/arabian-ranches-properteis.jpg" },
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
const photoNames: Record<string, string> = {
  "the-greens": "Greens",
  "dubai-production-city-impz": "Dubai Production City",
  "akoya-oxygen": "Damac Hills 2",
  "nadd-al-sheba": "Nad Al Sheba",
  "dubai-land": "Dubai Land Residence Complex",
};
// Reuse curated community photography first, then that community's own listing photography.
// A general Dubai skyline is a decorative fallback for guides without a community photograph.
const neighbourhoods = areas.map((area) => {
  const community = communityBySlug.get(communityAliases[area.slug] ?? area.slug);
  return {
    ...area,
    image: community?.image ?? area.image ?? communityPhoto(photoNames[area.slug] ?? area.name) ?? "/images/downtown-dubai.webp",
    text: community?.description ?? `Explore properties in ${area.name} and find a home that suits your lifestyle, priorities and investment plans.`,
  };
});

export default function DubaiNeighbourhoodsPage() {
  return (
    <>
      <section
        className="relative flex min-h-[500px] items-center bg-[#222] bg-cover bg-right bg-no-repeat md:bg-[length:30%_auto]"
        style={{ backgroundImage: "url(/wp-content/uploads/2020/11/Combined-Shape.png)" }}
      >
        <div className="mx-auto w-full max-w-[1300px] px-5 py-20">
          <div className="md:w-[65%]">
            <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-1px] text-white md:text-[50px]">Popular Dubai Neighbourhoods</h1>
            <p className="mt-3 text-[18px] font-medium leading-[1.7] text-white/85">
              This guide breaks down some of the most frequented Dubai neighborhoods so you can experience the real Dubai and get a feel for how these enclaves
              flavor the city.
            </p>
          </div>
        </div>
      </section>

      <section className="pl-neighbourhoods bg-mist pb-20 pt-[30px]">
        <Container>
          <div className="my-[30px]">
            <AreaSelect areas={areas.map((a) => ({ name: a.name, href: `/area/${a.slug}/` }))} />
          </div>

          <ul className="pl-neighbourhood-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {neighbourhoods.map((area) => (
              <li key={area.slug}>
                <AreaCard title={area.name} text={area.text} image={area.image} href={`/area/${area.slug}/`} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
