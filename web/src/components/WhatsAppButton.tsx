"use client";

// Floating WhatsApp contact button, mounted once in the root layout so it is on every page
// (site pages and standalone landing pages alike).
//
// It is deliberately the LOWEST of the floating controls: `ScrollTop` sits directly above it
// (see the offsets in components/ScrollTop.tsx). Both use z-40 so the sticky header, the mobile
// menu (z-50/z-[60]) and the landing gallery lightbox (z-[100]) still cover them.

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { WhatsAppGlyph } from "./icons";

const MESSAGE = `Hello ${site.name}, I'd like to enquire about a property.`;
const WHATSAPP_HREF = `${site.whatsappHref}?text=${encodeURIComponent(MESSAGE)}`;

export default function WhatsAppButton() {
  // Entrance: mount hidden, then fade/rise in once. `motion-reduce` drops the transition, so a
  // reduced-motion visitor simply gets the button with no movement.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setShown(true), 150);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${site.name} on WhatsApp`}
      className={`fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-[opacity,translate,scale,background-color,box-shadow] duration-300 ease-out hover:bg-[#1da851] hover:scale-105 hover:shadow-[0_10px_26px_rgba(0,0,0,0.28)] motion-reduce:transition-none md:bottom-6 md:right-6 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <WhatsAppGlyph />
    </a>
  );
}
