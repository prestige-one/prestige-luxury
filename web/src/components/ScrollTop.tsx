"use client";

import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-40 grid h-[44px] w-[44px] animate-[img-fade-in_0.3s_ease-out] place-items-center rounded-[2px] bg-[#222] text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:bg-accent md:bottom-6 md:right-6"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="m6 15 6-6 6 6" />
      </svg>
    </button>
  );
}
