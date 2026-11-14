import { Button, Container, SectionTitle } from "@/components/ui";
import PropertyCard from "@/components/listings/PropertyCard";
import { privateHighlights, privateCollectionDescription } from "@/lib/private-collection";

export default function PrivateCollection() {
  return <section className="pl-private-collection border-y border-line bg-smoke py-16 md:py-20">
    <Container>
      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Exceptional addresses. Individual character.</p>
      <SectionTitle title="The Prestige Private Collection" subtitle={privateCollectionDescription} />
      <div className="grid gap-6 md:grid-cols-3">{privateHighlights.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
      <div className="mt-10 text-center"><Button href="/exclusive-collection/">Explore the Private Collection</Button></div>
    </Container>
  </section>;
}
