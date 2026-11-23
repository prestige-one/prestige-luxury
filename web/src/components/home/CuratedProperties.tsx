import { connection } from "next/server";
import { Button, Container, SectionTitle } from "@/components/ui";
import PropertyCard from "@/components/listings/PropertyCard";
import { searchProperties } from "@/lib/properties";
import { randomSample } from "@/lib/random-sample";

const burjKhalifaListings = searchProperties({ location: "Burj Khalifa" })
  .filter((property) => property.images.length > 0);
const sales = burjKhalifaListings.filter((property) => property.purpose === "sale");
const rentals = burjKhalifaListings.filter((property) => property.purpose === "rent");

/** Select on the server; only three cards render and no listing dataset enters the client bundle. */
export default async function CuratedProperties() {
  await connection();
  const featured = [...randomSample(sales, 1), ...randomSample(rentals, 1)];
  const remaining = burjKhalifaListings.filter((property) => !featured.includes(property));
  const selection = [...featured, ...randomSample(remaining, 3 - featured.length)];
  if (!selection.length) return null;
  return (
    <section className="pl-curated-properties bg-white py-16 md:py-20">
      <Container>
        <div data-pl-reveal><SectionTitle title="A Curated Collection of Dubai Properties" /></div>
        <div data-pl-reveal-group className="pl-curated-grid grid gap-6 md:grid-cols-3">
          {selection.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
        <div data-pl-reveal className="mt-9 text-center">
          <Button href="/properties/">Explore More</Button>
        </div>
      </Container>
    </section>
  );
}
