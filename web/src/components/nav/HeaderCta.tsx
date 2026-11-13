import Link from "next/link";
import { navCta } from "@/lib/site";

/**
 * "List Your Property" — the header's primary action. Same shape as `Button` in components/ui.tsx
 * (2px corners, medium weight, the same transition), in accent rather than black, and slimmer in
 * the bar so the seven menu items still fit on one line at 1024px.
 */
export default function HeaderCta({ variant = "bar" }: { variant?: "bar" | "drawer" }) {
  const size =
    variant === "drawer"
      ? "min-h-[48px] w-full px-7 py-3 text-[14px]"
      : "h-[36px] px-3.5 text-[12px] xl:h-[38px] xl:px-5 xl:text-[13px]";
  return (
    <Link
      href={navCta.href}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[2px] bg-accent text-center font-medium tracking-[0.02em] text-white transition-[background-color,box-shadow,translate] duration-300 ease-out hover:bg-accent-dark hover:shadow-[0_6px_18px_rgba(0,0,0,0.18)] active:translate-y-px motion-reduce:transition-none ${size}`}
    >
      {navCta.label}
    </Link>
  );
}
