"use client";

import { useEffect } from "react";
import { initCurrency } from "./store";

/**
 * Starts the currency bootstrap (saved choice + live rates) once, as early in the tree as
 * possible. It renders nothing of its own and holds no state: the store in `./store` is the
 * single source of truth, so `useCurrency()` keeps working even where this is not mounted.
 * Mount it inside the root layout's <body>, wrapping {children}.
 */
export default function CurrencyProvider({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    initCurrency();
  }, []);
  return <>{children}</>;
}
