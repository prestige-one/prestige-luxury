"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui";

const metrics = [
  { value: 20, eyebrow: "Our Track Record", label: "Years of Experience", accessible: "20+ Years of Experience", icon: <><path d="M7 3v4M17 3v4M3 10h18" /><rect x="3" y="5" width="18" height="16" rx="2" /><path d="m8 15 3 3 5-6" /></> },
  { value: 60, eyebrow: "Clients From", label: "Countries", accessible: "Clients From 60+ Countries", icon: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" /></> },
  { value: 100, eyebrow: "Our Team", label: "Property Specialists", accessible: "100+ Property Specialists", icon: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 4v3" /></> },
];

/** One observer and one animation loop for the whole row; no per-frame React renders. */
export default function ExperienceCounters() {
  const root = useRef<HTMLElement>(null);
  const numbers = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const running = new Map<number, number>();
    const tick = (now: number) => {
      for (const [index, start] of running) {
        const progress = Math.min((now - start) / 1400, 1);
        const eased = 1 - (1 - progress) ** 3;
        if (numbers.current[index]) numbers.current[index]!.textContent = `${Math.round(metrics[index].value * eased)}+`;
        if (progress === 1) running.delete(index);
      }
      frame = running.size ? requestAnimationFrame(tick) : 0;
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        running.set(Number(entry.target.getAttribute("data-counter-index")), performance.now());
        observer.unobserve(entry.target);
      }
      if (running.size && !frame) frame = requestAnimationFrame(tick);
    }, { threshold: 0.35 });
    root.current.querySelectorAll(".pl-experience-card").forEach((card) => observer.observe(card));
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section ref={root} className="pl-experience-counters border-b border-line bg-white py-12 md:py-16" aria-label="Prestige Luxury in numbers">
      <Container>
        <div className="grid gap-5 md:grid-cols-3">
          {metrics.map((metric, index) => (
            <article key={metric.value} data-counter-index={index} className="pl-experience-card relative rounded-[4px] border border-line bg-mist px-7 py-8 text-center md:py-10">
              <span className="sr-only">{metric.accessible}</span>
              <div aria-hidden="true">
                <svg className="mx-auto mb-5 text-ink" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35">{metric.icon}</svg>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{metric.eyebrow}</p>
                <span ref={(element) => { numbers.current[index] = element; }} className="pl-counter-value mt-3 block text-[48px] font-medium leading-none tracking-[-0.04em] text-black tabular-nums md:text-[60px]">{metric.value}+</span>
                <p className="mt-4 text-[15px] text-body">{metric.label}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
