"use client";

import { useRef, useState, type ReactNode } from "react";
import { Chevron } from "@/components/listings/PropertyImageSlider";

/** Native scroll snapping supports touch, trackpads and keyboard without an animation loop. */
export default function ProjectSlider({ children, count }: { children: ReactNode; count: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const go = (step: number) => {
    const el = track.current;
    if (!el) return;
    const cards = el.children;
    const next = (position + step + count) % count;
    const card = cards[next] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - (cards[0] as HTMLElement).offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const control = "flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return <div className="pl-project-slider min-w-0" role="region" aria-roledescription="carousel" aria-label="Prestige One projects">
    <div className="mb-5 flex items-center justify-between gap-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">Explore the projects</p>
      <div className="flex shrink-0 items-center gap-3"><span className="mr-2 shrink-0 whitespace-nowrap text-[12px] tabular-nums text-white/65" aria-live="polite">{String(position + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        <button type="button" className={control} onClick={() => go(-1)} aria-label="Previous project"><Chevron reverse /></button>
        <button type="button" className={control} onClick={() => go(1)} aria-label="Next project"><Chevron /></button>
      </div>
    </div>
    <div ref={track} className="pl-project-track relative flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:thin] [scrollbar-color:#666_transparent]"
      onScroll={(e) => {
        const el = e.currentTarget;
        const width = (el.children[0] as HTMLElement)?.offsetWidth + 24;
        const atEnd = el.scrollWidth - el.clientWidth - el.scrollLeft < 2;
        setPosition(atEnd ? count - 1 : Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / width))));
      }}>
      {children}
    </div>
  </div>;
}
