"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencySelect from "@/components/currency/CurrencySelect";
import HeaderCta from "@/components/nav/HeaderCta";
import MegaPanel from "@/components/nav/MegaPanel";
import MobileNavItem from "@/components/nav/MobileNavItem";
import { Chevron } from "@/components/nav/NavIcon";
import { mainNav, site } from "@/lib/site";
import { activeNavHref } from "@/lib/nav-active";

/**
 * Matches the original Houzez header:
 * - homepage: transparent over the hero video, white logo + white menu; turns white once you scroll
 * - every other page: white bar with black logo and navigation
 * The bar gets slightly slimmer once the page is scrolled.
 */
export default function Header() {
  const pathname = usePathname();
  const currentNavHref = activeNavHref(mainNav, pathname);
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers the page it was opened on, so it closes by itself after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  // Which mobile accordion is unfolded (one at a time, reset whenever the drawer closes).
  const [expanded, setExpanded] = useState<string | null>(null);
  // The desktop mega panel opens purely from CSS :hover / :focus-within. After clicking a link
  // inside it the navigation is client-side, so the pointer is still inside the item's subtree
  // and the panel stayed open over the new page. Unmounting the panel for that one item closes
  // it; moving the pointer off the menu item clears the flag and hover works again.
  const [dismissed, setDismissed] = useState<string | null>(null);
  const setOpen = (v: boolean) => {
    setOpenOn(v ? pathname : null);
    if (!v) setExpanded(null); // the drawer always reopens with every section folded
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock page scroll and close on Escape while it is open.
  // `overflow: hidden` alone is not enough (the body keeps scrolling on iOS and behind the
  // overlay in some browsers), so the body is pinned in place and the scroll position restored.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const body = document.body;
    const y = window.scrollY;
    const scrollbar = window.innerWidth - root.clientWidth; // 0 on touch devices
    const prev = {
      rootOverflow: root.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    root.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`; // no sideways jump on desktop

    const close = () => {
      setOpenOn(null);
      setExpanded(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    // the drawer is mobile-only: closing it on the way to desktop avoids a locked page with no menu
    const desktop = window.matchMedia("(min-width: 1200px)");
    const onDesktop = () => desktop.matches && close();
    desktop.addEventListener("change", onDesktop);
    return () => {
      desktop.removeEventListener("change", onDesktop);
      root.style.overflow = prev.rootOverflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;
      // jump straight back to where the page was (html has `scroll-behavior: smooth`)
      const prevBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      root.style.scrollBehavior = prevBehavior;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = !overHero || scrolled;
  const bar = overHero
    ? scrolled
      ? "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]"
      : "bg-transparent"
    : "border-b border-line bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]";
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
          className={`relative mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 transition-[height] duration-300 ease-out lg:px-6 2xl:px-[60px] ${
            scrolled ? "h-[66px]" : "h-[80px]"
          }`}
        >
          <Link href="/" aria-label={site.name} className="shrink-0">
            <Image
              src={light ? site.logoBlack : site.logoWhite}
              alt={site.name}
              // the files' true intrinsic size, so Next derives the right aspect ratio
              width={438}
              height={82}
              priority
              className={`h-auto transition-[width] duration-300 ease-out motion-reduce:transition-none ${
                scrolled ? "w-[160px] 2xl:w-[200px]" : "w-[172px] min-[1200px]:w-[200px] 2xl:w-[240px]"
              }`}
            />
          </Link>

          <nav className="ml-auto hidden h-full min-w-0 min-[1200px]:block" aria-label="Main">
            {/* Keep laptop navigation compact; wider screens have room for more spacing. */}
            <ul className="flex h-full items-center gap-[14px] 2xl:gap-[26px]">
              {mainNav.map((item) => {
                const active = item.href === currentNavHref;
                return (
                  <li
                    key={item.label}
                    className="group relative flex h-full items-center"
                    onMouseLeave={() => setDismissed((d) => (d === item.label ? null : d))}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        (document.activeElement as HTMLElement | null)?.blur();
                        setDismissed(item.label);
                      }}
                      aria-current={active ? (pathname === item.href ? "page" : "location") : undefined}
                      className={`relative flex h-full items-center gap-1 whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.05em] 2xl:gap-1.5 2xl:text-[13px] 2xl:tracking-[0.08em] ${text} transition-opacity duration-200 hover:opacity-75`}
                    >
                      {item.label}
                      {item.children && (
                        <Chevron className={`transition-transform duration-300 motion-reduce:transition-none ${dismissed !== item.label ? "group-hover:rotate-180 group-focus-within:rotate-180" : ""}`} />
                      )}
                      {/* Only the owning section is underlined; hover changes opacity. */}
                      <span
                        aria-hidden
                        className={`pl-nav-indicator absolute inset-x-0 top-[calc(50%+13px)] h-[2px] origin-left ${light ? "bg-ink" : "bg-white"} transition-transform duration-300 ease-out ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                    {item.mega && dismissed !== item.label && (
                      <MegaPanel
                        mega={item.mega}
                        barHeight={scrolled ? 66 : 80}
                        onNavigate={() => setDismissed(item.label)}
                      />
                    )}
                    {/* "More" is the last item in the bar, so its plain dropdown hangs from the right edge */}
                    {!item.mega && item.children && dismissed !== item.label && (
                      <ul className="invisible absolute right-[-20px] top-full min-w-[220px] translate-y-2 rounded-[2px] border-t-2 border-accent bg-white py-2.5 opacity-0 shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-[opacity,translate,visibility] duration-300 ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <Link
                              href={c.href}
                              onClick={() => {
                                (document.activeElement as HTMLElement | null)?.blur();
                                setDismissed(item.label);
                              }}
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

          {/* Right-hand actions, desktop only: currency first, then the primary call to action */}
          <div className="hidden shrink-0 items-center gap-2 min-[1200px]:flex">
            <CurrencySelect light={light} />
            <HeaderCta light={light} />
          </div>

          <button
            type="button"
            className={`-mr-2 grid h-11 w-11 place-items-center min-[1200px]:hidden ${text}`}
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
      <div className={`fixed inset-0 z-[60] overflow-hidden min-[1200px]:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
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
            <Image src={site.logoWhite} alt={site.name} width={438} height={82} className="h-auto w-[140px]" />
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
            {mainNav.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                active={item.href === currentNavHref}
                pathname={pathname}
                expanded={expanded === item.label}
                onToggle={() => setExpanded((prev) => (prev === item.label ? null : item.label))}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </ul>
          <div className="shrink-0 space-y-3 border-t border-white/10 px-6 py-5">
            <CurrencySelect variant="drawer" />
            <HeaderCta variant="drawer" />
          </div>
          <div className="shrink-0 space-y-1 border-t border-white/10 px-6 pb-5 pt-4 text-[14px] text-white/75">
            <a href={site.phoneHref} className="flex min-h-[44px] items-center transition-colors hover:text-white">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex min-h-[44px] items-center transition-colors hover:text-white">
              {site.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
