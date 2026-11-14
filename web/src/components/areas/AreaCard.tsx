import Link from "next/link";
import Media from "@/components/Media";

/** Compact area tile; CSS reveals the description without a listener on every card. */
export default function AreaCard({ title, text, image, href }: {
  title: string; text: string; image: string; href: string;
}) {
  return <Link href={href} className="pl-area-card group relative isolate flex h-[310px] items-end overflow-hidden rounded-[12px] border-0 bg-transparent text-white focus-visible:outline-none md:h-[330px]">
    <Media src={image} alt="" fill sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw" className="scale-[1.015] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none" />
    <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
    <div className="relative z-10 w-full px-5 pb-5 pt-16">
      <h3 className="mt-1 text-[20px] font-medium leading-[1.25] tracking-[-0.02em] group-focus-visible:underline group-focus-visible:decoration-2 group-focus-visible:underline-offset-4">{title}</h3>
      <p className="pl-area-description mt-3 max-h-[42px] overflow-hidden text-[12px] leading-[21px] text-white/85 transition-[max-height] duration-400 ease-out motion-reduce:transition-none">{text}</p>
    </div>
  </Link>;
}
