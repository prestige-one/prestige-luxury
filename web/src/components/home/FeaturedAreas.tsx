import AreaCard from "@/components/areas/AreaCard";
import { Container, SectionTitle } from "@/components/ui";

const areas = [
  { title: "Dubai Islands", slug: "dubai-islands", image: "/images/dubai-Islands-1.webp", text: "An emerging waterfront investment destination offering luxury beachfront properties, strong capital appreciation potential and long-term growth opportunities." },
  { title: "Meydan Horizon", slug: "meydan-horizon", image: "/wp-content/uploads/2019/05/mbr-city-dubai.jpg", text: "A prestigious residential destination attracting investors with luxury developments, rental demand and long-term property value appreciation." },
  { title: "Dubai Maritime City", slug: "dubai-maritime-city", image: "/images/dubai-maritime.webp", text: "A growing waterfront location offering premium residences, limited waterfront supply and potential for rental returns and capital appreciation." },
  { title: "Dubai Sports City", slug: "dubai-sports-city", image: "/images/dubai-sport-city-1.webp", text: "A vibrant community with golf views, world-class sports facilities and well-connected apartments for active living and long-term investment." },
];

export default function FeaturedAreas() {
  return <section className="pl-featured-areas bg-mist py-16 md:py-20">
    <Container>
      <SectionTitle title="Explore Dubai's Most Sought-After Communities" subtitle="Discover some of Dubai's most desirable residential and investment locations, each offering its own lifestyle, amenities and property opportunities." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Landscape originals need enough height for the portrait crop, not just the tile width. */}
        {areas.map((area) => <AreaCard key={area.slug} {...area} href={`/area/${area.slug}/`} imageSizes="640px" imageQuality={85} />)}
      </div>
    </Container>
  </section>;
}
