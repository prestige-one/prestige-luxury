import { Button, Container, SectionTitle } from "@/components/ui";
import PropertyCard from "@/components/listings/PropertyCard";
import { properties } from "@/lib/properties";
import { randomSample } from "@/lib/random-sample";

function* photographedListings() {
  for (const property of properties) if (property.images.length) yield property;
}

/** Select on the server; only three cards render and no listing dataset enters the client bundle. */
export default function CuratedProperties() {
  const selection = randomSample(photographedListings(), 3);
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
