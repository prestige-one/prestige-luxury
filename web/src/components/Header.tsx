"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, site, type NavItem } from "@/lib/site";

/** True when `href` is the current page (or a section the current page belongs to). */
function isActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/") return pathname === "/";
  if (pathname.startsWith(item.href)) return true;
  return item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
}

/**
 * Matches the original Houzez header:
 * - homepage: transparent over the hero video, white logo + white menu; turns white once you scroll
 * - every other page: solid black bar with white logo
 * The bar gets slightly slimmer once the page is scrolled.
 */
export default function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers the page it was opened on, so it closes by itself after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock page scroll and close on Escape while it is open
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = overHero && scrolled; // white bar, dark text
  const bar = overHero
    ? scrolled
      ? "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]"
      : "bg-transparent"
    : scrolled
      ? "bg-black shadow-[0_2px_16px_rgba(0,0,0,0.25)]"
      : "bg-black";
  const text = light ? "text-ink" : "text-white";

  return (
    <>
      <header
        className={`${overHero ? "fixed" : "sticky"} inset-x-0 top-0 z-50 transition-[background-color,box-shadow,margin] duration-300 ease-out ${bar} ${
          // the sticky bar keeps its 80px of page flow when it slims down, so content does not jump
          !overHero && scrolled ? "mb-[14px]" : ""
        }`}
      >
        {/* soft top shade keeps the white menu legible over bright video frames */}
        {overHero && !scrolled && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-black/45 to-transparent" aria-hidden />
        )}
        <div
          className={`relative mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-[height] duration-300 ease-out lg:px-[60px] ${
            scrolled ? "h-[66px]" : "h-[80px]"
          }`}
        >
          <Link href="/" aria-label={site.name} className="shrink-0">
            <Image
              src={light ? site.logoBlack : site.logoWhite}
              alt={site.name}
              width={140}
              height={46}
              priority
              className={`h-auto transition-[width] duration-300 ease-out ${scrolled ? "w-[110px] lg:w-[124px]" : "w-[120px] lg:w-[140px]"}`}
            />
          </Link>

          <nav className="hidden h-full lg:block" aria-label="Main">
            <ul className="flex h-full items-center gap-[30px]">
              {mainNav.map((item) => {
                const active = isActive(item, pathname);
                return (
                  <li key={item.label} className="group relative flex h-full items-center">
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`relative flex h-full items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] ${text} transition-opacity duration-200 hover:opacity-75`}
                    >
                      {item.label}
                      {item.children && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                          className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                      {/* active-page / hover indicator */}
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 top-[calc(50%+13px)] h-[2px] origin-left bg-accent transition-transform duration-300 ease-out ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                    {item.children && (
                      <ul className="invisible absolute left-[-20px] top-full min-w-[220px] translate-y-2 rounded-[2px] border-t-2 border-accent bg-white py-2.5 opacity-0 shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-[opacity,translate,visibility] duration-300 ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <Link
                              href={c.href}
                              className={`block px-5 py-2.5 text-[13px] transition-[color,background-color,padding] duration-200 hover:bg-mist hover:pl-6 hover:text-accent ${
                                pathname.startsWith(c.href) ? "text-accent" : "text-ink"
                              }`}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            className={`-mr-2 grid h-11 w-11 place-items-center lg:hidden ${text}`}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M3 6h18M3 12h18M7 18h14" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu: full-height panel sliding in from the right */}
      <div className={`fixed inset-0 z-[60] overflow-hidden lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className={`absolute inset-y-0 right-0 flex w-[88%] max-w-[380px] flex-col bg-black text-white shadow-[-10px_0_40px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[80px] shrink-0 items-center justify-between border-b border-white/10 px-6">
            <Image src={site.logoWhite} alt={site.name} width={140} height={46} className="h-auto w-[110px]" />
            <button
              type="button"
              className="-mr-2 grid h-11 w-11 place-items-center text-white"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
            {mainNav.map((item) => {
              const active = isActive(item, pathname);
              return (
                <li key={item.label} className="border-b border-white/10 last:border-0">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`flex min-h-[54px] items-center gap-3 text-[14px] font-medium uppercase tracking-[0.08em] transition-colors ${
                      active ? "text-white" : "text-white/80 hover:text-white"
                    }`}
                  >
                    <span aria-hidden className={`h-[2px] bg-accent transition-[width] duration-300 ${active ? "w-4" : "w-0"}`} />
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="-mt-1 pb-3 pl-4">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <Link
                            href={c.href}
                            onClick={() => setOpen(false)}
                            className={`flex min-h-[44px] items-center text-[14px] transition-colors ${
                              pathname.startsWith(c.href) ? "text-white" : "text-white/65 hover:text-white"
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="shrink-0 space-y-1 border-t border-white/10 px-6 py-5 text-[14px] text-white/75">
            <a href={site.phoneHref} className="block py-1.5 transition-colors hover:text-white">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="block py-1.5 transition-colors hover:text-white">
              {site.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
