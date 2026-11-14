"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Chevron } from "@/components/nav/NavIcon";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { setCurrency, useCurrency } from "./store";

type Props = {
  /** "bar": the compact pill in the desktop header. "drawer": the full-width row in the mobile menu. */
  variant?: "bar" | "drawer";
  /** Dark text on the white scrolled homepage bar. Ignored by the (always dark) drawer. */
  light?: boolean;
  className?: string;
};

/**
 * The currency picker. Shows the active code; choosing another converts every `<Price>` on the
 * page and is remembered for the next visit. Prices are always quoted in AED — anything else is
 * an indicative conversion, which the panel says and `<Price>` marks with "≈".
 */
export default function CurrencySelect({ variant = "bar", light = false, className = "" }: Props) {
  const { code } = useCurrency();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = useId();
  const drawer = variant === "drawer";

  // Close on Escape or on a click anywhere else, returning focus to the trigger on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      wrap.current?.querySelector("button")?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const tone = drawer || !light ? "text-white" : "text-ink";
  const edge = drawer || !light ? "border-white/25 hover:border-white/60" : "border-ink/20 hover:border-ink/50";

  const choose = (next: CurrencyCode) => {
    setCurrency(next);
    setOpen(false);
  };

  return (
    <div ref={wrap} className={`relative ${drawer ? "w-full" : ""} ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`Currency: ${code}. Change currency`}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-[2px] border font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${tone} ${edge} ${
          drawer ? "min-h-[48px] w-full justify-between px-4 text-[14px]" : "h-[36px] px-2.5 text-[12px] 2xl:h-[38px] 2xl:px-3 2xl:text-[13px]"
        }`}
      >
        {drawer && <span className="normal-case tracking-normal text-white/75">Currency</span>}
        <span className="flex items-center gap-1.5">
          {code}
          <Chevron className={`transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Currency"
          className={`absolute z-20 min-w-[210px] rounded-[2px] border-t-2 border-accent bg-white py-2 shadow-[0_14px_40px_rgba(0,0,0,0.18)] ${
            drawer ? "bottom-full left-0 mb-2 w-full" : "right-0 top-[calc(100%+10px)]"
          }`}
        >
          {CURRENCIES.map((c) => {
            const active = c.code === code;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => choose(c.code)}
                  className={`flex w-full items-center justify-between gap-6 px-5 text-left text-[13px] transition-[color,background-color,padding] duration-200 hover:bg-mist hover:pl-6 hover:text-accent ${
                    drawer ? "min-h-[48px]" : "py-2.5"
                  } ${active ? "text-accent" : "text-ink"}`}
                >
                  <span className="font-medium tracking-[0.04em]">{c.code}</span>
                  <span className="text-[12px] text-muted">{c.label}</span>
                </button>
              </li>
            );
          })}
          <li className="mt-1 border-t border-line px-5 pt-2.5 text-[11px] leading-[1.5] text-muted">
            Prices are quoted in AED. Other currencies are indicative.
          </li>
        </ul>
      )}
    </div>
  );
}
