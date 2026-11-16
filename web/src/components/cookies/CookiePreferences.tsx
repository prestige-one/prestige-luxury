"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cookieSettingsEvent, declinedChoices, saveCookieChoices, useCookieChoices, type CookieChoices } from "./preferences";

const categories: { key: keyof CookieChoices; title: string; description: string }[] = [
  { key: "analytics", title: "Analytics", description: "Allows optional website usage measurement. No analytics service is currently installed; this choice is saved for future integrations." },
  { key: "marketing", title: "Marketing", description: "Allows optional advertising measurement and personalised marketing. No marketing service is currently installed; this choice is saved for future integrations." },
  { key: "externalContent", title: "External content", description: "Allows embedded Google Maps. The provider receives your IP address and may use its own cookies or storage. These embeds remain blocked until you allow them." },
];

export default function CookiePreferences() {
  const choices = useCookieChoices();
  const [draft, setDraft] = useState<CookieChoices>(declinedChoices);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  function open() { setDraft({ ...choices }); dialog.current?.showModal(); }
  function save(next: CookieChoices) { saveCookieChoices(next); dialog.current?.close(); }
  useEffect(() => {
    const handle = () => { setDraft({ ...choices }); dialog.current?.showModal(); };
    window.addEventListener(cookieSettingsEvent, handle);
    return () => window.removeEventListener(cookieSettingsEvent, handle);
  }, [choices]);

  return <>
    <button ref={trigger} type="button" onClick={open} aria-label="Cookie preferences" aria-haspopup="dialog" aria-controls="pl-cookie-dialog"
      className="pl-cookie-trigger fixed bottom-5 left-5 z-40 grid size-11 cursor-pointer place-items-center rounded-full border border-white/40 bg-[#111] text-white shadow-md transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20.8 11.2a4.2 4.2 0 0 1-4-5.4 4.5 4.5 0 0 1-4-3.6A9.8 9.8 0 1 0 21.8 13a4 4 0 0 1-1-1.8Z" /><circle cx="8" cy="8" r=".7" fill="currentColor" /><circle cx="7" cy="14" r=".7" fill="currentColor" /><circle cx="13" cy="16" r=".7" fill="currentColor" /><circle cx="12" cy="11" r=".7" fill="currentColor" /></svg>
    </button>
    <dialog ref={dialog} id="pl-cookie-dialog" aria-labelledby="pl-cookie-title" aria-describedby="pl-cookie-description" onClose={() => trigger.current?.focus()} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      className="pl-cookie-dialog m-auto max-h-[calc(100dvh-24px)] w-[calc(100%-24px)] max-w-[680px] overflow-y-auto overscroll-contain rounded-[6px] border border-black/15 bg-white p-0 text-ink shadow-2xl backdrop:bg-black/65">
      <div className="relative p-5 sm:p-6">
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close cookie preferences" className="absolute right-5 top-5 grid size-10 cursor-pointer place-items-center rounded-full border border-line text-[24px] font-light hover:bg-mist focus-visible:outline-2 focus-visible:outline-black">×</button>
        <p className="pr-12 text-[9px] font-medium uppercase tracking-[0.2em] text-muted">Prestige Luxury</p>
        <h2 id="pl-cookie-title" className="mt-2 pr-12 text-[23px] font-medium leading-tight">Cookie preferences</h2>
        <p id="pl-cookie-description" className="mt-4 text-[12px] leading-[1.7]">Choose what you’re comfortable sharing. Optional services stay off until you allow them. You can change your choices at any time using the cookie settings icon.</p>
        <Link href="/privacy-policy/" onClick={() => dialog.current?.close()} className="mt-2 inline-block text-[12px] underline underline-offset-4">Privacy policy</Link>
        <div className="mt-4 divide-y divide-line">
          <details open className="py-3.5"><summary className="cursor-pointer text-[13px] font-medium"><span>Necessary</span><span className="float-right text-[11px]">Always active</span></summary><p className="mt-3 text-[12px] leading-[1.7] text-muted">Supports essential website functions, saved currency and this consent choice. Necessary storage is always active. Your cookie choices are saved in this browser for up to 180 days.</p></details>
          {categories.map(({ key, title, description }) => <div key={key} className="relative py-3.5">
            <button type="button" role="switch" aria-checked={draft[key]} aria-label={title} onClick={() => setDraft((current) => ({ ...current, [key]: !current[key] }))}
              className={`absolute right-0 top-4 flex h-6 w-11 cursor-pointer items-center rounded-full border p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${draft[key] ? "border-black bg-black" : "border-black/25 bg-black/15"}`}><span className={`size-[18px] rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none ${draft[key] ? "translate-x-5" : "translate-x-0"}`} /></button>
            <details open><summary className="mr-16 cursor-pointer text-[13px] font-medium">{title}</summary><p className="mt-3 text-[12px] leading-[1.7] text-muted">{description}</p></details>
          </div>)}
        </div>
        <p className="border-t border-line pt-4 text-[11px] leading-[1.7] text-muted">Changes apply when you save. Turning off external content removes embedded maps from the page.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <button type="button" onClick={() => save(declinedChoices)} className="min-h-11 cursor-pointer rounded-[2px] border border-black px-3 text-[12px] font-medium hover:bg-mist">Decline optional</button>
          <button type="button" onClick={() => save({ analytics: true, marketing: true, externalContent: true })} className="min-h-11 cursor-pointer rounded-[2px] border border-black px-3 text-[12px] font-medium hover:bg-mist">Accept all</button>
          <button type="button" onClick={() => save(draft)} className="min-h-11 cursor-pointer rounded-[2px] border border-black bg-black px-3 text-[12px] font-medium text-white hover:opacity-75">Save preferences</button>
        </div>
      </div>
    </dialog>
  </>;
}
