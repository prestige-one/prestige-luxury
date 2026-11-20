// Shared building blocks that reproduce the look of the original Houzez/Elementor widgets.
import Media from "@/components/Media";
import Link from "next/link";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1140px] px-5 ${className}`}>{children}</div>;
}

/** "houzez_elementor_section_title": centred title + grey subtitle */
export function SectionTitle({
  title,
  subtitle,
  light = false,
  className = "",
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`mx-auto mb-10 max-w-[760px] text-center md:mb-14 ${className}`}>
      <h2
        className={`font-heading font-medium capitalize leading-[1.2] tracking-[-0.01em] ${light ? "text-white" : "text-ink"} text-section`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mx-auto mt-4 max-w-[620px] text-[15px] leading-[1.7] ${light ? "text-white/80" : "text-muted"}`}>{subtitle}</p>
      )}
    </div>
  );
}

type ButtonProps = { href: string; children: React.ReactNode; variant?: "dark" | "light" | "outline"; className?: string };
export function Button({ href, children, variant = "dark", className = "" }: ButtonProps) {
  // Buttons are black-and-white only (owner's instruction, 2026-11-14): no mauve fills. Both
  // filled variants simply invert on hover, and `light` keeps a hairline so a white button still
  // reads as a button on a pale background.
  const styles = {
    dark: "bg-black text-white hover:bg-white hover:text-ink ring-1 ring-inset ring-black",
    light: "bg-white text-ink ring-1 ring-inset ring-black/15 hover:bg-black hover:text-white hover:ring-black",
    outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  }[variant];
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);
  const cls = `inline-flex min-h-[48px] items-center justify-center rounded-[2px] px-7 py-3 text-center text-[14px] font-medium tracking-[0.02em] transition-[background-color,color,border-color,box-shadow,translate] duration-300 ease-out hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${styles} ${className}`;
  return isExternal ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Banner used at the top of inner pages: background photo with dark overlay and centred title */
export function PageBanner({ title, subtitle, image, imageQuality, imageClassName = "opacity-55", path }: { title: string; subtitle?: string; image?: string; imageQuality?: number; imageClassName?: string; path?: string }) {
  return (
    <section className="pl-page-banner relative flex min-h-[260px] items-center justify-center overflow-hidden bg-black text-center md:min-h-[340px]">
      {path && <BreadcrumbStructuredData items={[{ name: title, path }]} />}
      {image && <Media src={image} alt="" fill priority tone="ink" sizes="100vw" quality={imageQuality} className={`object-cover ${imageClassName}`} />}
      {image && <div className="pl-page-banner-overlay absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/65" aria-hidden />}
      <div className="relative z-10 px-5 py-16 md:py-20">
        <h1 className="text-[30px] font-medium capitalize leading-[1.2] tracking-[-0.01em] text-white sm:text-[34px] md:text-[44px]">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-[680px] text-[15px] leading-[1.7] text-white/85 md:text-[16px]">{subtitle}</p>}
      </div>
    </section>
  );
}

/** Renders HTML copied from WordPress (blog posts, policy pages). */
export function WpContent({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`wp-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Image card with title + text underneath (Elementor "image-box") */
export function ImageCard({
  href,
  image,
  title,
  text,
  tone = "mist",
  aspect = "aspect-[347/249]",
  compact = false,
  radius = 2,
}: {
  href: string;
  image: string;
  title: string;
  text: string;
  tone?: "mist" | "white" | "smoke";
  aspect?: string;
  compact?: boolean;
  radius?: 2 | 8;
}) {
  return (
    <Link
      href={href}
      className={`pl-image-card group block h-full overflow-hidden ${radius === 8 ? "rounded-[8px]" : "rounded-[2px]"} border border-line transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,0.09)] ${tone === "smoke" ? "bg-smoke" : tone === "mist" ? "bg-mist" : "bg-white"}`}
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        <Media
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 350px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className={compact ? "px-4 py-4 text-center" : "px-4 pb-7 pt-6 text-center"}>
        <h3 className="text-[18px] uppercase tracking-[0.04em] text-ink transition-colors duration-300 group-hover:text-accent md:text-[20px]">{title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.6] text-body">{text}</p>
      </div>
    </Link>
  );
}
