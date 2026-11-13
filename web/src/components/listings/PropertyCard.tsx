import Media from "@/components/Media";
import Link from "next/link";
import Price from "@/components/Price";
import { type Property } from "@/lib/properties";
import { addressLine, bedsLabel, isUnoptimized, propertyStatus, sizedImage, sqft } from "@/lib/listing-format";
import { AreaIcon, BathIcon, BedIcon, HomeIcon, PinIcon } from "./icons";

/**
 * Houzez "item-wrap" listing card. Rendered on the server.
 * Inside a `group/results` element with data-view="list" it switches to the horizontal list layout.
 */
export default function PropertyCard({ property: p, priority = false }: { property: Property; priority?: boolean }) {
  const href = `/property/${p.slug}/`;
  const status = propertyStatus(p);
  const image = p.images[0] ? sizedImage(p.images[0], "card") : undefined;
  const beds = bedsLabel(p.bedrooms);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-line bg-white transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_14px_34px_rgba(0,0,0,0.09)] sm:group-data-[view=list]/results:flex-row sm:group-data-[view=list]/results:hover:translate-y-0">
      <Link
        href={href}
        className="relative block aspect-[4/3] shrink-0 overflow-hidden bg-smoke sm:group-data-[view=list]/results:aspect-auto sm:group-data-[view=list]/results:min-h-[230px] sm:group-data-[view=list]/results:w-[44%]"
        tabIndex={-1}
        aria-hidden
      >
        {image ? (
          <Media
            src={image}
            alt=""
            fill
            priority={priority}
            unoptimized={isUnoptimized(image)}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-muted">
            <HomeIcon size={40} />
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-[2px] bg-black/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white backdrop-blur-sm">
          {status.label}
        </span>
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-[18px] font-semibold text-white">
          <Price price={p.price} purpose={p.purpose} rentFrequency={p.rentFrequency} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-5 pb-4 pt-4">
        <h3 className="text-[16px] font-medium leading-snug text-ink">
          <Link href={href} className="transition-colors duration-200 hover:text-accent">
            {p.title}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-start gap-1.5 text-[13px] text-muted">
          <PinIcon className="mt-[3px] shrink-0" />
          <span>{addressLine(p)}</span>
        </p>
        <ul className="mb-4 mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-body">
          {beds && (
            <li className="flex items-center gap-1.5">
              <BedIcon />
              {beds}
            </li>
          )}
          {p.bathrooms !== null && (
            <li className="flex items-center gap-1.5">
              <BathIcon />
              {p.bathrooms} {p.bathrooms === 1 ? "Bath" : "Baths"}
            </li>
          )}
          {p.sizeSqft !== null && (
            <li className="flex items-center gap-1.5">
              <AreaIcon />
              {sqft(p.sizeSqft)}
            </li>
          )}
        </ul>
        <p className="mt-auto border-t border-line pt-3 text-[13px] text-muted">{p.type}</p>
      </div>
    </article>
  );
}
