"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** One observer per page; server-rendered content stays visible without JavaScript. */
export default function ScrollReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!scope || motion.matches || !("IntersectionObserver" in window) || !HTMLElement.prototype.animate) return;

    const targets = new Map<HTMLElement, number>();
    scope.querySelectorAll<HTMLElement>("[data-pl-reveal]").forEach((element) => targets.set(element, 0));
    scope.querySelectorAll<HTMLElement>("[data-pl-reveal-group]").forEach((group) => {
      Array.from(group.children).forEach((element, index) => {
        if (element instanceof HTMLElement) targets.set(element, (index % 4) * 140);
      });
    });
    const pending = new Set(targets.keys());
    const animations = new Set<Animation>();

    const reveal = (element: HTMLElement, animate = true) => {
      if (!pending.delete(element)) return;
      element.classList.remove("pl-reveal-pending");
      element.style.removeProperty("opacity");
      observer.unobserve(element);
      if (!animate || motion.matches) return;
      const animation = element.animate(
        [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
        { duration: 1100, delay: targets.get(element), easing: "cubic-bezier(.2,.65,.3,1)", fill: "backwards" },
      );
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => { animations.delete(animation); };
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target as HTMLElement);
    }, { rootMargin: "0px 0px -24px 0px", threshold: 0 });

    const showImmediately = () => {
      observer.disconnect();
      pending.forEach((element) => {
        element.classList.remove("pl-reveal-pending");
        element.style.removeProperty("opacity");
      });
      pending.clear();
      animations.forEach((animation) => animation.cancel());
    };
    const onMotionChange = () => { if (motion.matches) showImmediately(); };
    const onFocus = (event: FocusEvent) => {
      const element = event.target instanceof Element ? event.target.closest<HTMLElement>(".pl-reveal-pending") : null;
      if (element) reveal(element, false);
    };

    pending.forEach((element) => {
      element.classList.add("pl-reveal-pending");
      element.style.opacity = "0";
      observer.observe(element);
    });
    scope.addEventListener("focusin", onFocus);
    motion.addEventListener("change", onMotionChange);
    window.addEventListener("beforeprint", showImmediately);
    return () => {
      showImmediately();
      scope.removeEventListener("focusin", onFocus);
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("beforeprint", showImmediately);
    };
  }, []);

  return <div ref={root} className="pl-scroll-reveal">{children}</div>;
}
