"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, site } from "@/lib/site";

/**
 * Matches the original Houzez header:
 * - homepage: transparent over the hero video, white logo + white menu; turns white once you scroll
 * - every other page: solid black bar with white logo
 */
export default function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const light = overHero && scrolled; // white bar, dark text
  const bar = overHero
    ? scrolled
      ? "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
      : "bg-transparent"
    : "bg-black";
  const text = light ? "text-ink" : "text-white";

  return (
    <header
      className={`${overHero ? "fixed" : "sticky"} inset-x-0 top-0 z-50 transition-colors duration-300 ${bar}`}
    >
      <div className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-5 lg:px-[60px]">
        <Link href="/" aria-label={site.name} className="shrink-0">
          <Image
            src={light ? site.logoBlack : site.logoWhite}
            alt={site.name}
            width={140}
            height={46}
            priority
            className="h-auto w-[120px] lg:w-[140px]"
          />
        </Link>

        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-[30px]">
            {mainNav.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 py-7 text-[13px] font-medium uppercase tracking-[0.06em] ${text} transition-opacity hover:opacity-70`}
                >
                  {item.label}
                  {item.children && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </Link>
                {item.children && (
                  <ul className="invisible absolute left-0 top-full min-w-[200px] translate-y-2 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <Link href={c.href} className="block px-5 py-2.5 text-[13px] text-ink hover:bg-mist">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={`lg:hidden ${text}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-black lg:hidden" aria-label="Mobile">
          <ul className="px-5 py-3">
            {mainNav.map((item) => (
              <li key={item.label} className="border-b border-white/10 last:border-0">
                <Link href={item.href} className="block py-3 text-[14px] font-medium uppercase tracking-wide text-white">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="pb-2 pl-4">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <Link href={c.href} className="block py-2 text-[13px] text-white/75">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
