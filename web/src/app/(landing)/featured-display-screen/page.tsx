import Image from "next/image";
import PropertyCard from "@/components/listings/PropertyCard";
import { getPage, seoMetadata } from "@/lib/content";
import { properties } from "@/lib/properties";

export const metadata = seoMetadata(getPage("/featured-display-screen/")!);

// Office display screen: logo + the latest properties for sale (Houzez "properties carousel" on the original)
export default function FeaturedDisplayScreenPage() {
  const featured = properties
    .filter((p) => p.purpose === "sale")
    .sort((a, b) => (b.listedAt ?? "").localeCompare(a.listedAt ?? ""))
    .slice(0, 6);

  return (
    <main className="min-h-screen px-5 pb-[50px] pt-10">
      <Image
        src="/wp-content/uploads/2022/11/logo-prestige-luxury-white-2x.png"
        alt="Prestige Luxury Real Estate"
        width={438}
        height={82}
        priority
        className="mx-auto h-auto w-[260px] md:w-[438px]"
      />
      <section aria-label="Featured properties for sale" className="mx-auto mt-[100px] max-w-[1400px]">
        {featured.length > 0 ? (
          <div className="grid gap-6 text-body sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <PropertyCard key={p.id} property={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[18px] text-white/70">Featured properties will appear here soon.</p>
        )}
      </section>
    </main>
  );
}
