import Link from "next/link";
import { navCta } from "@/lib/site";

/**
 * "List Your Property" — the header's primary action. Same shape as `Button` in components/ui.tsx
 * (2px corners, medium weight, the same transition), and slimmer in the bar so the seven menu
 * items still fit on one line at 1024px. The button inverts with the header background.
 */
export default function HeaderCta({ variant = "bar", light = false }: { variant?: "bar" | "drawer"; light?: boolean }) {
  const size =
    variant === "drawer"
      ? "min-h-[48px] w-full px-7 py-3 text-[14px]"
      : "h-[36px] px-3.5 text-[12px] xl:h-[38px] xl:px-5 xl:text-[13px]";
  return (
    <Link
      href={navCta.href}
      className={`pl-header-cta inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[2px] text-center font-medium tracking-[0.02em] ring-1 ring-inset ring-black/15 transition-[background-color,color,box-shadow,translate] duration-300 ease-out ${light ? "bg-black text-white hover:bg-white hover:text-black" : "bg-white text-ink hover:bg-black hover:text-white"} hover:shadow-[0_6px_18px_rgba(0,0,0,0.18)] hover:ring-black active:translate-y-px motion-reduce:transition-none ${size}`}
    >
      {navCta.label}
    </Link>
  );
}
