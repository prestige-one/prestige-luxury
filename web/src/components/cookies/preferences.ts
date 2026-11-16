"use client";

import { useMemo, useSyncExternalStore } from "react";

export type CookieChoices = { analytics: boolean; marketing: boolean; externalContent: boolean };
export const declinedChoices: CookieChoices = { analytics: false, marketing: false, externalContent: false };
export const COOKIE_STORAGE_KEY = "pl-cookie-preferences";
const CHANGE_EVENT = "pl-cookie-preferences-change";
const SETTINGS_EVENT = "pl-cookie-settings-open";
export const cookieSettingsEvent = SETTINGS_EVENT;
let sessionValue = "";
let sessionOnly = false;

function snapshot() {
  let raw = sessionValue;
  try { raw = sessionOnly ? sessionValue : localStorage.getItem(COOKIE_STORAGE_KEY) ?? ""; } catch { /* Storage may be disabled. */ }
  if (!raw) return "";
  try {
    const value = JSON.parse(raw);
    return value.version === 1 && Number.isFinite(value.expiresAt) && value.expiresAt > Date.now()
      && [value.analytics, value.marketing, value.externalContent].every((choice) => typeof choice === "boolean") ? raw : "";
  } catch { return ""; }
}

function subscribe(notify: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === COOKIE_STORAGE_KEY || event.key === null) notify(); };
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener("storage", storage);
  window.addEventListener("focus", notify);
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener("storage", storage);
    window.removeEventListener("focus", notify);
  };
}

export function useCookieChoices(): CookieChoices {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  return useMemo(() => raw ? JSON.parse(raw) as CookieChoices : declinedChoices, [raw]);
}

export function saveCookieChoices(choices: CookieChoices) {
  sessionValue = JSON.stringify({ ...choices, version: 1, expiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000 });
  try { localStorage.setItem(COOKIE_STORAGE_KEY, sessionValue); sessionOnly = false; } catch { sessionOnly = true; }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openCookieSettings() { window.dispatchEvent(new Event(SETTINGS_EVENT)); }
