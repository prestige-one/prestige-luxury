import type { NavItem } from "./site";

/** Pick one owning menu section; cross-links in mega menus never activate extra items. */
export function activeNavHref(items: NavItem[], pathname: string): string | null {
  const page = pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
  if (page === "/") return null;
  const matches = (href: string) => href !== "/" && page.startsWith(`${href.replace(/\/+$/, "")}/`);
  let direct: NavItem | undefined;
  for (const item of items) {
    if (matches(item.href) && (!direct || item.href.length > direct.href.length)) direct = item;
  }
  if (direct) return direct.href;

  const owner = page.startsWith("/area/") || page === "/dubai-neighbourhoods/" ? "/areas/"
    : /^\/(?:property|property-type|properties|search-results|advanced-search-results)\//.test(page)
      ? page.includes("-for-rent-") ? "/status/for-rent/" : "/status/for-sale/"
      : /^\/(?:blog|category|marketing|construction|luxury-living|luxury-property-market|real-estate)\//.test(page)
        ? "/contact-us/" : null;
  if (owner && items.some((item) => item.href === owner)) return owner;

  // A plain dropdown owns its pages, even if a mega panel cross-links to the same FAQ or team page.
  const plain = items.find((item) => !item.mega && item.children?.some((child) => matches(child.href)));
  if (plain) return plain.href;
  let best: { href: string; length: number } | undefined;
  for (const item of items) for (const child of item.children || []) {
    if (matches(child.href) && (!best || child.href.length > best.length)) best = { href: item.href, length: child.href.length };
  }
  return best?.href || null;
}
