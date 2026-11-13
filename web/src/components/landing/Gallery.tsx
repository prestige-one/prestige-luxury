"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = { src: string; width: number; height: number; alt?: string };

/**
 * Image gallery with a full-screen lightbox.
 * - `carousel`: horizontal scroll-snap slider with arrows (Elementor "image-carousel"/"media-carousel")
 * - `grid`: thumbnail grid (Elementor "gallery"/"image-gallery")
 */
export default function Gallery({
  images,
  layout = "carousel",
  perView = 1,
  columns = 3,
  rounded = false,
  aspect = "aspect-[1500/885]",
  className = "",
}: {
  images: GalleryImage[];
  layout?: "carousel" | "grid";
  perView?: 1 | 2;
  columns?: 2 | 3;
  rounded?: boolean;
  aspect?: string;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const radius = rounded ? "rounded-[15px]" : "";

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={className}>
      {layout === "carousel" ? (
        <div className="relative">
          <div ref={track} className="lp-snap flex snap-x snap-mandatory gap-[10px] overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setOpen(i)}
                className={`relative shrink-0 snap-start overflow-hidden ${aspect} ${radius} ${
                  perView === 2 ? "w-full md:w-[calc(50%-5px)]" : "w-full"
                }`}
                aria-label={`Open image ${i + 1} of ${images.length}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt ?? ""}
                  fill
                  sizes={perView === 2 ? "(min-width: 768px) 50vw, 100vw" : "100vw"}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          {images.length > perView && (
            <>
              <Arrow dir={-1} onClick={() => scroll(-1)} className="left-3 rtl:left-auto rtl:right-3" />
              <Arrow dir={1} onClick={() => scroll(1)} className="right-3 rtl:right-auto rtl:left-3" />
            </>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 md:gap-5 ${columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden ${aspect} ${radius}`}
              aria-label={`Open image ${i + 1} of ${images.length}`}
            >
              <Image
                src={img.src}
                alt={img.alt ?? ""}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/50" />
            </button>
          ))}
        </div>
      )}
      {open !== null && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Arrow({ dir, onClick, className }: { dir: 1 | -1; onClick: () => void; className: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Next image" : "Previous image"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/70 ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="rtl:-scale-x-100">
        <path d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
      </svg>
    </button>
  );
}

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const go = useCallback((d: number) => onIndex((index + d + images.length) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [go, onClose]);

  const img = images[index];
  return (
    <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[100] bg-black/95" onClick={onClose} dir="ltr">
      <div className="absolute inset-4 md:inset-16" onClick={(e) => e.stopPropagation()}>
        <Image src={img.src} alt={img.alt ?? ""} fill sizes="100vw" className="object-contain" />
      </div>
      <p className="absolute left-4 top-4 text-[13px] text-white/70">
        {index + 1} / {images.length}
      </p>
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 p-2 text-white/80 hover:text-white">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      {images.length > 1 && (
        <>
          <span onClick={(e) => e.stopPropagation()}>
            <Arrow dir={-1} onClick={() => go(-1)} className="left-3" />
            <Arrow dir={1} onClick={() => go(1)} className="right-3" />
          </span>
        </>
      )}
    </div>
  );
}
