import Image from "next/image";
import Link from "next/link";
import { formatPrice, properties } from "@/lib/properties";
import { isUnoptimized } from "@/lib/listing-format";
import { featuredListings, sidebarTypes } from "@/lib/listing-views";
import RecentlyViewed from "./RecentlyViewed";

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-white p-6">
      <h2 className="mb-5 border-b border-line pb-3 text-[17px] font-medium text-ink">{title}</h2>
      {children}
    </section>
  );
}

/** Right column of the listing archive: Recently Viewed, Property Type, Featured Listings. */
export default function ListingSidebar({ exclude }: { exclude?: string }) {
  const featured = featuredListings(3).filter((p) => p.slug !== exclude);
  return (
    <aside className="space-y-8">
      <Widget title="Recently Viewed Properties">
        <RecentlyViewed slugs={properties.map((p) => p.slug)} exclude={exclude} />
      </Widget>

      <Widget title="Property Type">
        <ul className="divide-y divide-line text-[14px]">
          {sidebarTypes.map((t) => (
            <li key={t.slug}>
              <Link href={`/property-type/${t.slug}/`} className="flex items-center justify-between py-2.5 text-body hover:text-accent">
                {t.label}
                <span aria-hidden className="text-muted">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Featured Listings">
        {featured.length ? (
          <ul className="space-y-5">
            {featured.map((p) => (
              <li key={p.id}>
                <Link href={`/property/${p.slug}/`} className="group block">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-smoke">
                    {p.images[0] && (
                      <Image
                        src={p.images[0]}
                        alt=""
                        fill
                        unoptimized={isUnoptimized(p.images[0])}
                        sizes="300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-8 text-[15px] font-semibold text-white">
                      {formatPrice(p)}
                    </span>
                  </span>
                  <span className="mt-2 block text-[14px] font-medium leading-snug text-ink group-hover:text-accent">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-muted">No listing found.</p>
        )}
      </Widget>
    </aside>
  );
}
