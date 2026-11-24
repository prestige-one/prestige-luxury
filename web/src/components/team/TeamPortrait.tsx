import Media from "@/components/Media";

/** Shared portrait framing for the team directory, profiles and related team cards. */
export default function TeamPortrait({ src, alt, sizes, preload = false, className = "" }: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return <div className={`pl-team-portrait relative aspect-[4/5] shrink-0 overflow-hidden bg-mist ${className}`}>
    <Media src={src} alt={alt} fill preload={preload} sizes={sizes} quality={85}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
  </div>;
}
