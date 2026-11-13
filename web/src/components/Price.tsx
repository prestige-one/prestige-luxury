"use client";

import { format, priceParts, type PriceInput } from "@/lib/currency";
import { useCurrency } from "@/components/currency/store";

type Props = PriceInput & {
  className?: string;
  /** Styling for the "/year" suffix, if it should differ from the figure. */
  perClassName?: string;
};

/**
 * A listing price. The amount handed in is always AED — the server renders it as AED (so the
 * markup, the metadata and the JSON-LD keep quoting the real asking price) and it is only
 * converted after hydration, for viewers who picked another currency in the header.
 */
export default function Price({ price, purpose, rentFrequency, className = "", perClassName = "" }: Props) {
  const { code, rates } = useCurrency();
  const input = { price, purpose, rentFrequency };
  const { amount, per, approximate } = priceParts(input, code, rates);

  return (
    <span
      className={className}
      title={approximate ? `Asking price ${format(input)} — converted at an indicative rate` : undefined}
    >
      {approximate && (
        <>
          <span aria-hidden className="mr-[3px] font-normal opacity-70">
            ≈
          </span>
          <span className="sr-only">approximately </span>
        </>
      )}
      {amount}
      {per && <span className={perClassName}>{per}</span>}
    </span>
  );
}
