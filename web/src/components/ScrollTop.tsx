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
  // Stacked directly above the floating WhatsApp button (56px tall at bottom-5 / md:bottom-6,
  // see components/WhatsAppButton.tsx), with a 12px gap. The odd `right` values centre this
  // 44px control on the 56px one below it.
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[88px] right-[26px] z-40 grid h-[44px] w-[44px] place-items-center rounded-[2px] bg-[#222] text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:bg-accent md:bottom-[92px] md:right-[30px]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="m6 15 6-6 6 6" />
      </svg>
    </button>
  );
}
