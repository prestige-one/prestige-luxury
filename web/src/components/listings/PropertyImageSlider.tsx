"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { isUnoptimized, sizedImage } from "@/lib/listing-format";
import { HomeIcon } from "./icons";

type PhotoState = {
  active: number;
  transition: { next: number; direction: 1 | -1; ready: boolean } | null;
  failed: boolean;
};

/** Load the incoming photo on demand, then slide two frames; idle cards mount only one. */
export default function PropertyImageSlider({ images, title, href, priority = false, children, className = "" }: {
  images: string[];
  title: string;
  href: string;
  priority?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const [photo, setPhoto] = useState<PhotoState>({ active: 0, transition: null, failed: false });
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const count = images.length;
  useEffect(() => {
    const transition = photo.transition;
    if (!transition) return;
    // Navigating away or hiding a cached page can cancel animationend. Never leave controls
    // locked on that event, and also recover if an image request never completes.
    const timeout = window.setTimeout(() => setPhoto((current) => {
      if (current.transition !== transition) return current;
      return transition.ready
        ? { active: transition.next, transition: null, failed: false }
        : { ...current, transition: null, failed: true };
    }), transition.ready ? 700 : 12_000);
    return () => window.clearTimeout(timeout);
  }, [photo.transition]);
  const active = photo.transition?.ready ? photo.transition.next : photo.active;
  const select = (next: number, direction?: 1 | -1) => setPhoto((current) => {
    if (current.transition?.ready || next === current.active || count < 2) return current;
    return { ...current, failed: false, transition: { next, direction: direction ?? (next > current.active ? 1 : -1), ready: false } };
  });
  const move = (step: number) => select((photo.active + step + count) % count, step > 0 ? 1 : -1);
  const startSlide = (index: number) => setPhoto((current) => {
    if (current.transition?.next !== index || current.transition.ready) return current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return { active: index, transition: null, failed: false };
    return { ...current, transition: { ...current.transition, ready: true } };
  });
  const finishSlide = (index: number) => setPhoto((current) => current.transition?.ready && current.transition.next === index ? { active: index, transition: null, failed: false } : current);
  const frames = photo.transition ? [photo.active, photo.transition.next] : [photo.active];
  const firstDot = Math.max(0, Math.min(active - 2, count - 5));
  const control = "pl-photo-arrow absolute top-1/2 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-transparent text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white [&_svg]:size-7";

  return (
    <div role="group" aria-roledescription="carousel" aria-label={`${title} photos`} aria-busy={!!photo.transition} className={`pl-photo-slider relative isolate aspect-[4/3] shrink-0 overflow-hidden bg-smoke ${className}`}
      onKeyDown={(e) => { if (count > 1 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); move(e.key === "ArrowRight" ? 1 : -1); } }}>
      <Link href={href} className="absolute inset-0 touch-pan-y select-none overflow-hidden" tabIndex={-1} aria-hidden draggable={false}
        style={{ "--pl-photo-direction": photo.transition?.direction ?? 1 } as CSSProperties}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={(e) => { if (!e.isPrimary || e.button !== 0) return; touch.current = { x: e.clientX, y: e.clientY }; swiped.current = false; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerCancel={() => { touch.current = null; }}
        onPointerUp={(e) => {
          if (!touch.current || count < 2) return;
          const dx = e.clientX - touch.current.x;
          const dy = e.clientY - touch.current.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { move(dx < 0 ? 1 : -1); swiped.current = true; }
          touch.current = null;
        }}
        onClick={(e) => { if (swiped.current) { e.preventDefault(); swiped.current = false; } }}
      >
        {count ? frames.map((index) => {
          const incoming = index !== photo.active;
          const source = sizedImage(images[index], "card");
          return <div key={index} className={`pl-photo-frame absolute inset-0 ${photo.transition?.ready ? incoming ? "pl-photo-incoming" : "pl-photo-outgoing" : ""}`}
            style={incoming ? { transform: `translateX(${photo.transition!.direction * 100}%)` } : undefined}
            onAnimationEnd={incoming ? (e) => { if (e.target === e.currentTarget) finishSlide(index); } : undefined}>
            <Image src={source} alt="" fill unoptimized={isUnoptimized(source)} preload={priority && index === 0}
              ref={incoming ? (image) => { if (image?.complete && image.naturalWidth > 0) startSlide(index); } : undefined}
              loading={priority && index === 0 ? undefined : incoming ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-cover"
              onLoad={incoming ? () => startSlide(index) : undefined}
              onError={incoming ? () => setPhoto((current) => current.transition?.next === index ? { ...current, transition: null, failed: true } : current) : undefined} />
          </div>;
        })
          : <span className="absolute inset-0 flex items-center justify-center text-muted"><HomeIcon size={40} /></span>}
      </Link>
      <div className="pointer-events-none absolute inset-0">{children}</div>
      {count > 1 && <>
        <button type="button" className={`${control} left-1`} aria-label="Previous photo" onClick={() => move(-1)}><Chevron reverse /></button>
        <button type="button" className={`${control} right-1`} aria-label="Next photo" onClick={() => move(1)}><Chevron /></button>
        <div className="pl-photo-dots absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center">
          {Array.from({ length: Math.min(5, count) }, (_, n) => firstDot + n).map((n) => <button key={n} type="button" aria-label={`Show photo ${n + 1}`} aria-current={n === active ? "true" : undefined}
            onClick={() => select(n)} className="flex h-7 w-4 cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-white">
            <span className={`rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-[width,height,opacity] motion-reduce:transition-none ${n === active ? "size-[9px] opacity-100" : Math.abs(n - active) === 1 ? "size-1.5 opacity-90" : "size-[3px] opacity-80"}`} />
          </button>)}
        </div>
      </>}
      {count > 0 && <span className="pl-photo-count pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-[3px] bg-white/95 px-1.5 py-1 text-[11px] font-medium leading-none text-ink" aria-hidden>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="3" width="16" height="14" rx="2" /><circle cx="7" cy="7.5" r="1.5" /><path d="m3 15 5-5 3 3 2-2 4 4" /></svg>{count}
      </span>}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{photo.failed ? "This photo could not be loaded. Please choose another photo." : count ? `Photo ${active + 1} of ${count}` : "No photos available"}</span>
    </div>
  );
}

export function Chevron({ reverse = false }: { reverse?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={reverse ? "rotate-180" : ""}><path d="m9 5 7 7-7 7" /></svg>;
}
