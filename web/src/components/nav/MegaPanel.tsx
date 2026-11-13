import Media from "@/components/Media";
import Link from "next/link";
import type { NavMega } from "@/lib/site";
import { NavIcon } from "./NavIcon";

/**
 * The white panel that drops out of the desktop header when a top-level item is hovered or
 * focused. It is rendered inside the item's `<li class="group">`, so it opens and closes purely
 * from CSS (`group-hover` / `group-focus-within`) — no JS state, and keyboard users get it too.
 *
 * Positioning is `fixed` and centred on the viewport rather than on the menu item: the panel is
 * wider than any single item, and centring on the item would push the edge ones off screen at
 * 1024px. The wrapper's top padding doubles as the invisible bridge the pointer travels across
 * on its way from the menu item down to the card.
 */
export default function MegaPanel({ mega, barHeight }: { mega: NavMega; barHeight: number }) {
  return (
    <div
      className="invisible pointer-events-none fixed inset-x-5 z-40 flex translate-y-2 justify-center opacity-0 transition-[opacity,translate,visibility] duration-[250ms] ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
      style={{ top: barHeight }}
    >
      {/* the top padding is the invisible bridge the pointer crosses from the menu item */}
      <div className="pointer-events-auto w-full max-w-[1080px] pt-[10px]">
        <div className="flex gap-10 rounded-[10px] bg-white px-10 py-9 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
          {/* LEFT: heading + link groups */}
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-semibold leading-snug text-ink">
              {mega.heading}
            </p>
            <div className="mt-6 space-y-6">
              {mega.groups.map((group) => (
                <div key={group.title ?? group.links[0]?.href}>
                  {group.title && (
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">
                      {group.title}
                    </p>
                  )}
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-[10px]">
                    {group.links.map((link) => (
                      <li key={link.label + link.href}>
                        <Link
                          href={link.href}
                          className="group/link flex items-center gap-2.5 text-[14px] leading-snug text-ink transition-colors duration-200 hover:text-accent"
                        >
                          {link.icon && (
                            <span className="shrink-0 text-ink/35 transition-colors duration-200 group-hover/link:text-accent">
                              <NavIcon name={link.icon} />
                            </span>
                          )}
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: promo card */}
          {mega.promo && (
            <div className="w-[420px] shrink-0 border-l border-ink/10 pl-10">
              <Link
                href={mega.promo.href}
                className="group/promo relative block aspect-[16/11] overflow-hidden rounded-[8px]"
              >
                <Media
                  src={mega.promo.image}
                  alt=""
                  fill
                  sizes="420px"
                  className="object-cover transition-transform duration-500 ease-out group-hover/promo:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/promo:scale-100"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 p-6">
                  <span className="text-[22px] font-semibold leading-tight text-white">
                    {mega.promo.title}
                  </span>
                  {mega.promo.subtitle && (
                    <span className="text-[14px] leading-snug text-white/80">
                      {mega.promo.subtitle}
                    </span>
                  )}
                  <span className="mt-3 inline-flex items-center rounded-full bg-white px-5 py-2 text-[13px] font-medium text-ink transition-colors duration-200 group-hover/promo:bg-accent group-hover/promo:text-white">
                    {mega.promo.cta}
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
