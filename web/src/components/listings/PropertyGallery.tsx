"use client";

import Media from "@/components/Media";
import { useCallback, useEffect, useRef, useState } from "react";
import { isUnoptimized, sizedImage } from "@/lib/listing-format";
import { ChevronIcon, CloseIcon, ExpandIcon } from "./icons";

/** Main photo + thumbnails, with a full-screen lightbox (native <dialog>: Esc closes, arrow keys navigate). */
export default function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const count = images.length;

  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  if (!count) return null;

  const alt = (i: number) => `${title} — photo ${i + 1} of ${count}`;
  const arrow =
    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white";

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-smoke">
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="group absolute inset-0 block w-full cursor-pointer"
          aria-label={`Open photo ${index + 1} of ${count} in full screen`}
        >
          <Media
            src={images[index]}
            alt={alt(index)}
            fill
            priority
            unoptimized={isUnoptimized(images[index])}
            sizes="(min-width: 1140px) 760px, 100vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-[2px] bg-black/60 px-2.5 py-1 text-[12px] text-white">
            <ExpandIcon size={14} />
            {index + 1} / {count}
          </span>
        </button>
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={`${arrow} left-3`} aria-label="Previous photo">
              <ChevronIcon dir="left" />
            </button>
            <button type="button" onClick={() => go(1)} className={`${arrow} right-3`} aria-label="Next photo">
              <ChevronIcon />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-2.5 grid grid-cols-4 gap-2.5 sm:grid-cols-6">
          {images.map((src, i) => (
            <li key={src + i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`relative block aspect-[4/3] w-full overflow-hidden bg-smoke outline-offset-2 transition-opacity ${
                  i === index ? "outline-2 outline-ink" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Media src={sizedImage(src, "thumb")} alt="" fill unoptimized={isUnoptimized(src)} sizes="130px" loading="lazy" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        aria-label={`${title} photos`}
        className="m-0 h-full max-h-none w-full max-w-none border-0 bg-black/95 p-0 text-white backdrop:bg-black/80"
      >
        <div
          className="relative flex h-full w-full items-center justify-center"
          onClick={(e) => {
            // click on the dark area around the photo closes the lightbox
            if (e.target === e.currentTarget) dialog.current?.close();
          }}
        >
          <div className="relative h-[80vh] w-[92vw]">
            <Media
              src={images[index]}
              alt={alt(index)}
              fill
              tone="ink"
              unoptimized={isUnoptimized(images[index])}
              sizes="92vw"
              className="object-contain"
            />
          </div>
          <p className="absolute left-4 top-4 text-[14px]" aria-live="polite">
            {index + 1} / {count}
          </p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Close"
            autoFocus
          >
            <CloseIcon />
          </button>
          {count > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className={`${arrow} left-3`} aria-label="Previous photo">
                <ChevronIcon dir="left" />
              </button>
              <button type="button" onClick={() => go(1)} className={`${arrow} right-3`} aria-label="Next photo">
                <ChevronIcon />
              </button>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
