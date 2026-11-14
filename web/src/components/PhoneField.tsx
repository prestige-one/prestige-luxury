"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type InputHTMLAttributes, type KeyboardEvent } from "react";
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";
import { normalizePhone } from "@/lib/phone";

const names = new Intl.DisplayNames(["en"], { type: "region" });
const countries = getCountries().map((code) => ({ code, name: names.of(code) || code, dial: `+${getCountryCallingCode(code)}` })).sort((a, b) => a.name.localeCompare(b.name, "en"));
const countryOptions = [countries.find((country) => country.code === "AE")!, ...countries.filter((country) => country.code !== "AE")];

function Flag({ code }: { code: CountryCode }) {
  return <Image src={`/flags/${code}.svg`} alt="" width={20} height={14} unoptimized className="h-[14px] w-5 shrink-0 rounded-[1px] object-cover" />;
}

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> & { dark?: boolean; whiteInputs?: boolean };

export default function PhoneField({ dark = false, whiteInputs = false, ...inputProps }: Props) {
  const [country, setCountry] = useState<CountryCode>("AE");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const numberInput = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = countries.find((item) => item.code === country)!;
  const filtered = countryOptions.filter((item) => `${item.name} ${item.code} ${item.dial}`.toLowerCase().includes(query.trim().toLowerCase()));
  const darkFields = dark && !whiteInputs;
  const palette = darkFields ? "border-white/25 bg-[#191919] text-white" : "border-line bg-white text-black";

  useEffect(() => {
    numberInput.current?.setCustomValidity(value.trim() && normalizePhone(value, country) === undefined ? "Please enter a valid phone number for the selected country." : "");
  }, [value, country]);

  useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const dismiss = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const buttons = Array.from(list.current?.querySelectorAll<HTMLButtonElement>("button") || []);
    if (!buttons.length) return;
    event.preventDefault();
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = current < 0 ? event.key === "ArrowDown" ? 0 : buttons.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  }

  return (
    <div ref={root} className="relative min-w-0" onKeyDown={keyboard} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}>
      <div className="flex min-w-0 gap-2" dir="ltr">
        <button ref={trigger} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={`${inputProps.id}-countries`}
          aria-label={`Country code for ${inputProps.name}: ${selected.name} ${selected.dial}`}
          onClick={() => { setQuery(""); setOpen(!open); }}
          className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[2px] border px-2.5 text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 ${palette} ${dark ? "focus-visible:outline-white" : "focus-visible:outline-black"}`}>
          <Flag code={country} /><span>{selected.dial}</span><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-hidden="true" className={open ? "rotate-180" : ""}><path d="m2 4 4 4 4-4" /></svg>
        </button>
        <input {...inputProps} ref={numberInput} type="tel" autoComplete="tel-national" inputMode="tel" maxLength={40} value={value}
          className={`${inputProps.className} min-w-0 flex-1`} dir="ltr"
          onChange={(event) => {
            const next = event.target.value;
            if (/^(\+|00)/.test(next.trim())) {
              const parsed = parsePhoneNumberFromString(next.trim().replace(/^00/, "+"));
              if (parsed?.country && parsed.isPossible()) { setCountry(parsed.country); setValue(parsed.nationalNumber); return; }
            }
            setValue(next);
          }} />
        <input type="hidden" name={`${inputProps.name}_country`} value={country} />
      </div>
      {open && (
        <div id={`${inputProps.id}-countries`} role="dialog" aria-label="Choose country calling code" className={`absolute start-0 top-full z-50 mt-2 w-full min-w-0 rounded-[8px] border p-2 shadow-[0_10px_32px_rgba(0,0,0,0.2)] ${palette}`}>
          <input ref={search} type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search country or code" placeholder="Search country or code" autoComplete="off"
            className={`mb-2 min-h-11 w-full rounded-[4px] border px-3 text-[13px] outline-offset-2 ${darkFields ? "border-white/20 bg-white/5 text-white placeholder:text-white/60" : "border-line bg-mist text-black"}`} />
          <ul ref={list} className="max-h-60 overflow-y-auto overscroll-contain">
            {filtered.map((item) => (
              <li key={item.code}>
                <button type="button" aria-pressed={country === item.code} onClick={() => { setCountry(item.code); setOpen(false); numberInput.current?.focus(); }}
                  className={`flex min-h-11 w-full items-center gap-2 rounded-[4px] px-2 py-2 text-start text-[12px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${darkFields ? "hover:bg-white/10 focus-visible:bg-white/10" : "hover:bg-black/5 focus-visible:bg-black/5"} ${country === item.code ? darkFields ? "bg-white/10" : "bg-black/5" : ""}`}>
                  <Flag code={item.code} /><span className="min-w-0 flex-1">{item.name}</span><span className="shrink-0 opacity-65">{item.dial}</span>
                </button>
              </li>
            ))}
          </ul>
          {!filtered.length && <p className="px-2 py-4 text-[13px]" role="status">No countries found.</p>}
        </div>
      )}
    </div>
  );
}
