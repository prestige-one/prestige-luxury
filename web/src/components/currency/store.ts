"use client";

// The chosen display currency, kept in a tiny module-level store rather than React context so
// that any client component (a price in a card, the picker in the header) can read it without
// the whole tree having to be wrapped. `CurrencyProvider` is still offered as the one place to
// start the bootstrap early; the hook works with or without it.
//
// Hydration rule: `getServerSnapshot` always reports AED, so the server HTML and the first
// client render agree (AED stays in the markup for crawlers). React re-renders with the real
// snapshot right after hydration, which is when a non-AED choice appears.

import { useEffect, useSyncExternalStore } from "react";
import {
  BASE,
  FALLBACK_RATES,
  isCurrencyCode,
  pickRates,
  RATES_ENDPOINT,
  RATES_TTL_MS,
  type CurrencyCode,
  type Rates,
} from "@/lib/currency";

export type CurrencyState = {
  code: CurrencyCode;
  /** Units per 1 AED — the bundled table until the live one arrives. */
  rates: Rates;
  /** True once live rates are in use (the bundled table is a snapshot of an older day). */
  live: boolean;
};

const CODE_KEY = "luxp:currency";
const RATES_KEY = "luxp:rates";

const INITIAL: CurrencyState = { code: BASE, rates: FALLBACK_RATES, live: false };

let state: CurrencyState = INITIAL;
const listeners = new Set<() => void>();

const emit = () => {
  for (const l of listeners) l();
};

function set(patch: Partial<CurrencyState>) {
  const next = { ...state, ...patch };
  if (next.code === state.code && next.rates === state.rates && next.live === state.live) return;
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
// Same object every time: the server (and the hydration pass) must always see plain AED.
const getServerSnapshot = () => INITIAL;

/** Switches the display currency and remembers it. Private mode can throw, so writing is optional. */
export function setCurrency(code: CurrencyCode) {
  set({ code });
  try {
    window.localStorage.setItem(CODE_KEY, code);
  } catch {
    // no persistence available — the choice still applies for this page view
  }
}

// ---- bootstrap -------------------------------------------------------------------------------

let started = false;

/** Restores the saved choice and tops up the rate table. Safe to call from anywhere, any number of times. */
export function initCurrency() {
  if (started || typeof window === "undefined") return;
  started = true;

  try {
    const saved = window.localStorage.getItem(CODE_KEY);
    if (isCurrencyCode(saved)) set({ code: saved });
  } catch {
    // ignore: no saved choice is simply AED
  }

  let cachedAt = 0;
  try {
    const raw = window.localStorage.getItem(RATES_KEY);
    if (raw) {
      const cached = JSON.parse(raw) as { at?: unknown; rates?: unknown };
      const rates = pickRates({ rates: cached.rates });
      if (rates && typeof cached.at === "number") {
        cachedAt = cached.at;
        if (Date.now() - cached.at < RATES_TTL_MS) set({ rates, live: true });
      }
    }
  } catch {
    // ignore: a bad cache entry just means we fetch again
  }

  if (Date.now() - cachedAt < RATES_TTL_MS) return;

  // Never blocks rendering, never sends anything about the viewer or the site: a bare GET.
  void (async () => {
    try {
      const res = await fetch(RATES_ENDPOINT, { cache: "no-store", referrerPolicy: "no-referrer", credentials: "omit" });
      if (!res.ok) return;
      const rates = pickRates(await res.json());
      if (!rates) return;
      set({ rates, live: true });
      try {
        window.localStorage.setItem(RATES_KEY, JSON.stringify({ at: Date.now(), rates }));
      } catch {
        // ignore: we simply refetch next time
      }
    } catch {
      // offline, blocked, rate-limited — the bundled table is already in place
    }
  })();
}

/** The active currency and rate table. AED during SSR and hydration. */
export function useCurrency(): CurrencyState {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    initCurrency();
  }, []);
  return snapshot;
}
