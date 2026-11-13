// Currency conversion for displayed prices.
//
// Every price in content/properties.json is in AED, which is what the server renders and what
// the JSON-LD / metadata always state. The viewer may switch the *display* currency; the result
// is explicitly an approximation (AED is the price actually being asked).
//
// Pure data + maths only — no React, no browser APIs — so this file is safe on the server too.

export type CurrencyCode = "AED" | "USD" | "GBP" | "EUR" | "INR" | "SAR" | "RUB" | "PKR";

export type Currency = {
  code: CurrencyCode;
  /** Shown beside the code in the picker. */
  label: string;
};

/** The base currency of every stored price. */
export const BASE: CurrencyCode = "AED";

export const CURRENCIES: readonly Currency[] = [
  { code: "AED", label: "UAE Dirham" },
  { code: "USD", label: "US Dollar" },
  { code: "GBP", label: "Pound Sterling" },
  { code: "EUR", label: "Euro" },
  { code: "INR", label: "Indian Rupee" },
  { code: "SAR", label: "Saudi Riyal" },
  { code: "RUB", label: "Russian Ruble" },
  { code: "PKR", label: "Pakistani Rupee" },
] as const;

const CODES = new Set<string>(CURRENCIES.map((c) => c.code));

export const isCurrencyCode = (v: unknown): v is CurrencyCode => typeof v === "string" && CODES.has(v);

/** Units of the currency per 1 AED. */
export type Rates = Partial<Record<CurrencyCode, number>>;

/**
 * Bundled fallback table, used until (or instead of) the live fetch.
 * Captured 13 November 2026 from open.er-api.com (exchangerate-api.com's free endpoint).
 *
 * AED is pegged to the US dollar at 3.6725 AED = 1 USD, so USD is exact and stays exact.
 * Everything else floats and is indicative only — never quote it as a price.
 */
export const FALLBACK_RATES: Required<Rates> = {
  AED: 1,
  USD: 1 / 3.6725, // the peg, not a market rate
  GBP: 0.205618,
  EUR: 0.246011,
  INR: 25.61898,
  SAR: 1.021103,
  RUB: 22.554049,
  PKR: 75.355174,
};

/** Date the table above was captured, for the "rates as of" note in the picker. */
export const FALLBACK_RATES_DATE = "13 November 2026";

/** AED → `code`, using `rates` (units per 1 AED) and falling back to the bundled table. */
export function convert(aed: number, code: CurrencyCode, rates?: Rates | null): number {
  if (code === BASE) return aed;
  const rate = rates?.[code] ?? FALLBACK_RATES[code];
  return aed * (Number.isFinite(rate) && rate > 0 ? rate : FALLBACK_RATES[code]);
}

/**
 * Converted figures carry false precision ("USD 2,041,663"), so they are rounded to a
 * sensible number of significant digits for their size. AED is never rounded.
 */
function tidy(amount: number): number {
  const abs = Math.abs(amount);
  const step = abs >= 1_000_000 ? 10_000 : abs >= 100_000 ? 1_000 : abs >= 10_000 ? 100 : abs >= 1_000 ? 10 : 1;
  return Math.round(amount / step) * step;
}

const grouped = (n: number) => new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);

export type PriceParts = {
  /** e.g. "AED 2,450,000" or "USD 667,000" */
  amount: string;
  /** e.g. "/year", or "" for sales */
  per: string;
  /** True for every currency other than AED: the figure is a conversion, not the asking price. */
  approximate: boolean;
};

export type PriceInput = { price: number; purpose?: "sale" | "rent"; rentFrequency?: "yearly" | "monthly" | "weekly" | "daily" };

const PER = { yearly: "/year", monthly: "/month", weekly: "/week", daily: "/day" } as const;

/** Splits a price into its parts so callers can style the "≈" and the "/year" suffix themselves. */
export function priceParts(p: PriceInput, code: CurrencyCode = BASE, rates?: Rates | null): PriceParts {
  const value = code === BASE ? p.price : tidy(convert(p.price, code, rates));
  return {
    amount: `${code} ${grouped(value)}`,
    per: p.purpose === "rent" ? PER[p.rentFrequency ?? "yearly"] : "",
    approximate: code !== BASE,
  };
}

/** Plain-text price, e.g. "AED 180,000/year" or "≈ USD 49,000/year". */
export function format(p: PriceInput, code: CurrencyCode = BASE, rates?: Rates | null): string {
  const { amount, per, approximate } = priceParts(p, code, rates);
  return `${approximate ? "≈ " : ""}${amount}${per}`;
}

// ---- Live rates ------------------------------------------------------------------------------

/** No key, no parameters, no user data — just the published AED table. */
export const RATES_ENDPOINT = "https://open.er-api.com/v6/latest/AED";

/** How long a fetched table is kept before it is refreshed. */
export const RATES_TTL_MS = 12 * 60 * 60 * 1000;

/** Narrows the endpoint's full table to the eight currencies the site offers. */
export function pickRates(payload: unknown): Rates | null {
  if (!payload || typeof payload !== "object") return null;
  const table = (payload as { rates?: unknown }).rates;
  if (!table || typeof table !== "object") return null;
  const out: Rates = {};
  for (const { code } of CURRENCIES) {
    const v = (table as Record<string, unknown>)[code];
    if (typeof v === "number" && Number.isFinite(v) && v > 0) out[code] = v;
  }
  // The peg is a fact, not a quote — keep it exact whatever the feed says.
  out.AED = 1;
  out.USD = FALLBACK_RATES.USD;
  return Object.keys(out).length > 2 ? out : null;
}
