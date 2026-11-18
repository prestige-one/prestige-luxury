"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Container } from "@/components/ui";
import GoogleReviewCard from "@/components/reviews/GoogleReviewCard";
import { homepageGoogleReviews } from "@/lib/google-reviews";

const INTERVAL_MS = 3000;

function slideStride(el: HTMLUListElement) {
  return el.children.length > 1 ? (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft : 0;
}

function lastSlide(el: HTMLUListElement, step: number) {
  return step ? Math.max(0, Math.round((el.scrollWidth - el.clientWidth) / step)) : 0;
}

export default function GoogleTestimonials() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const index = useRef(0);
  const [active, setActive] = useState(0);
  const [touching, setTouching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const running = visible && pageVisible && !touching && !reducedMotion;

  const go = useCallback((direction: number) => {
    const el = track.current;
    if (!el) return;
    const step = slideStride(el);
    const positions = lastSlide(el, step) + 1;
    const destination = (index.current + direction + positions) % positions;
    el.scrollTo({ left: destination * step, behavior: reducedMotion ? "instant" : "smooth" });
  }, [reducedMotion]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReducedMotion(media.matches);
    const visibility = () => setPageVisible(!document.hidden);
    motion();
    visibility();
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    if (root.current) observer.observe(root.current);
    const resize = new ResizeObserver(() => {
      const el = track.current;
      if (!el) return;
      const step = slideStride(el);
      index.current = Math.min(index.current, lastSlide(el, step));
      el.scrollTo({ left: index.current * step, behavior: "instant" });
    });
    if (track.current) resize.observe(track.current);
    return () => {
      observer.disconnect();
      resize.disconnect();
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    // Pointer hover and focused controls must not stop automatic advancement after a click.
    const timer = window.setInterval(() => go(1), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [running, go]);

  function onScroll() {
    const el = track.current;
    if (!el) return;
    const step = slideStride(el);
    if (!step) return;
    const position = Math.max(0, Math.min(lastSlide(el, step), Math.round(el.scrollLeft / step)));
    index.current = position;
    setActive(position);
  }

  const control = "grid size-11 cursor-pointer place-items-center rounded-[6px] border border-line bg-white text-black transition-colors hover:border-black hover:bg-black hover:text-white motion-reduce:transition-none";

  return (
    <section ref={root} aria-labelledby="pl-google-testimonials-title" aria-roledescription="carousel" data-active-review={active} data-autoplay={running ? "running" : "paused"}
      className="pl-google-testimonials bg-white py-16 md:py-20"
      onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); go(event.key === "ArrowRight" ? 1 : -1); } }}>
      <Container className="grid items-stretch gap-9 lg:grid-cols-[0.7fr_1.6fr] lg:gap-12">
        <div className="flex flex-col items-start">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted">Client Experiences</p>
          <h2 id="pl-google-testimonials-title" className="mt-2 font-medium leading-tight tracking-[-0.02em] text-ink text-section">What Our Clients Say</h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-muted">Personal service, local knowledge and support through the details. Explore a selection of five-star Google reviews from our clients.</p>
          <div className="mt-4 flex items-center gap-3">
            <button type="button" aria-label="Previous review" className={control} onClick={() => go(-1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg></button>
            <button type="button" aria-label="Next review" className={control} onClick={() => go(1)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg></button>
          </div>
          <div className="mt-6 lg:mt-auto lg:pt-6"><Button href="/testimonials/" className="gap-3">Read More <span aria-hidden="true">↗</span></Button></div>
        </div>
        <div className="min-w-0">
          <ul ref={track} onScroll={onScroll} onPointerDown={() => setTouching(true)} onPointerUp={() => setTouching(false)} onPointerCancel={() => setTouching(false)} onPointerLeave={() => setTouching(false)}
            className="no-scrollbar relative flex h-full snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain" aria-label="Selected five-star Google reviews">
            {homepageGoogleReviews.map((review) => <li key={review.id} className="w-full shrink-0 snap-start md:w-[calc((100%_-_24px)/2)]">
              <GoogleReviewCard review={review} />
            </li>)}
          </ul>
        </div>
      </Container>
    </section>
  );
}
