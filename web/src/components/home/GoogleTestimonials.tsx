"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui";
import { googleReviews, googleReviewsUrl } from "@/lib/google-reviews";

const INTERVAL_MS = 3000;
const count = googleReviews.length;
const slides = [...googleReviews, ...googleReviews.slice(0, 2)];

function Stars() {
  return <div role="img" aria-label="5 out of 5 stars" className="flex gap-1 text-[#e5ad00]">
    {Array.from({ length: 5 }, (_, index) => <svg key={index} width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.76 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2Z" /></svg>)}
  </div>;
}

export default function GoogleTestimonials() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const index = useRef(0);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const running = visible && pageVisible && !hovered && !focused && !touching && !reducedMotion;

  const stride = () => {
    const el = track.current;
    return el && el.children.length > 1 ? (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft : 0;
  };

  const go = useCallback((direction: number) => {
    const el = track.current;
    if (!el) return;
    const current = index.current % count;
    const next = current + direction;
    const destination = next < 0 ? count - 1 : next;
    el.scrollTo({ left: destination * stride(), behavior: reducedMotion || next < 0 ? "instant" : "smooth" });
  }, [reducedMotion]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReducedMotion(media.matches);
    const visibility = () => setPageVisible(!document.hidden);
    motion();
    visibility();
    setHovered(root.current?.matches(":hover") ?? false);
    setFocused(root.current?.contains(document.activeElement) ?? false);
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    if (root.current) observer.observe(root.current);
    const resize = new ResizeObserver(() => track.current?.scrollTo({ left: (index.current % count) * stride(), behavior: "instant" }));
    if (track.current) resize.observe(track.current);
    return () => {
      observer.disconnect();
      resize.disconnect();
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
      clearTimeout(settle.current);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      // Native interaction can happen before hydration attaches React's event handlers.
      const over = root.current?.matches(":hover") ?? false;
      const focus = root.current?.contains(document.activeElement) ?? false;
      if (over || focus) { setHovered(over); setFocused(focus); return; }
      go(1);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [running, go]);

  function onScroll() {
    const el = track.current;
    const step = stride();
    if (!el || !step) return;
    const position = Math.round(el.scrollLeft / step);
    index.current = position;
    setActive(position % count);
    clearTimeout(settle.current);
    // Trailing copies let the final review slide naturally into the first one.
    settle.current = setTimeout(() => {
      if (position >= count) {
        el.scrollTo({ left: (position % count) * stride(), behavior: "instant" });
        index.current = position % count;
      }
    }, 180);
  }

  const control = "grid size-11 place-items-center rounded-[6px] border border-line bg-white text-black transition-colors hover:border-black hover:bg-black hover:text-white motion-reduce:transition-none";

  return (
    <section ref={root} aria-labelledby="google-testimonials-title" aria-roledescription="carousel" data-active-review={active} data-autoplay={running ? "running" : "paused"}
      className="pl-google-testimonials bg-white py-16 md:py-20"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}
      onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); go(event.key === "ArrowRight" ? 1 : -1); } }}>
      <Container className="grid items-stretch gap-9 lg:grid-cols-[0.7fr_1.6fr] lg:gap-12">
        <div className="flex flex-col items-start">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted">Client Experiences</p>
          <h2 id="google-testimonials-title" className="mt-2 font-medium leading-tight tracking-[-0.02em] text-ink text-section">What Our Clients Say</h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-muted">Personal service, local knowledge and support through the details. Explore a selection of five-star Google reviews from our clients.</p>
          <div className="mt-4 flex items-center gap-3">
            <button type="button" aria-label="Previous review" className={control} onClick={() => go(-1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg></button>
            <button type="button" aria-label="Next review" className={control} onClick={() => go(1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg></button>
          </div>
          <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-12 items-center justify-center gap-3 rounded-[2px] border border-black bg-white px-7 py-3 text-[14px] font-medium text-black transition-colors hover:bg-black hover:text-white motion-reduce:transition-none lg:mt-auto">Read All <span aria-hidden="true">↗</span></a>
        </div>
        <div className="min-w-0">
          <ul ref={track} onScroll={onScroll} onPointerDown={() => setTouching(true)} onPointerUp={() => setTouching(false)} onPointerCancel={() => setTouching(false)} onPointerLeave={() => setTouching(false)}
            className="no-scrollbar relative flex h-full snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain" aria-label="Selected five-star Google reviews">
            {slides.map((review, position) => {
              const copy = position >= count;
              return <li key={`${review.id}-${position}`} aria-hidden={copy ? true : undefined} className="w-full shrink-0 snap-start md:w-[calc((100%_-_24px)/2)]">
                <figure className="flex h-full min-h-[340px] flex-col rounded-[8px] border border-line bg-[#fbfbfb] p-6">
                  <Stars />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-[1.75] text-body">“{review.text}”</blockquote>
                  <figcaption className="mt-6">
                    <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined} aria-label={`Read ${review.author}’s review on Google`} className="group inline-flex min-h-12 items-center gap-3">
                      <Image src={`/images/reviews/${review.id}.webp`} alt="" width={44} height={44} className="size-11 shrink-0 rounded-full object-cover" />
                      <span><span className="block text-[14px] font-medium text-ink group-hover:underline underline-offset-4">{review.author}</span><span className="mt-1 block text-[12px] text-muted">Google review</span></span>
                    </a>
                  </figcaption>
                </figure>
              </li>;
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
