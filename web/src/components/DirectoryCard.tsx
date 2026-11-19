import Link from "next/link";
import Media from "@/components/Media";
import type { ReactNode } from "react";

/** Shared photograph-and-summary layout for developer and community directories. */
export default function DirectoryCard({ href, title, description, image, imageAlt, imageQuality, imageSizes = "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw", branding, showArrow = false, className = "", imageClassName = "" }: {
  href: string; title: string; description?: string | null; image: string; imageAlt: string;
  branding?: ReactNode; showArrow?: boolean; className?: string; imageClassName?: string; imageQuality?: number; imageSizes?: string;
}) {
  return <Link href={href} className={`pl-directory-card group block h-full rounded-[10px] bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${className}`}>
    <div className={`pl-directory-photo relative aspect-[4/3] overflow-hidden rounded-[10px] bg-smoke ${imageClassName}`}>
      <Media src={image} alt={imageAlt} fill quality={imageQuality} sizes={imageSizes} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:transition-none" />
      {branding}
    </div>
    <div className="pt-5">
      <h3 className="flex items-start gap-2.5 text-[17px] font-medium leading-[1.4] text-ink md:text-[18px]">
        {title}{showArrow && <span aria-hidden className="mt-0.5 shrink-0 text-[16px] font-normal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none">↗</span>}
      </h3>
      {description && <p className="pl-directory-description mt-2 line-clamp-3 text-[13.5px] leading-[1.7] text-muted">{description}</p>}
    </div>
  </Link>;
}
