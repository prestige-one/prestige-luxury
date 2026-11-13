// Shared building blocks that reproduce the look of the original Houzez/Elementor widgets.
import Image from "next/image";
import Link from "next/link";

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
        className={`font-heading text-[26px] font-normal capitalize leading-[1.2] tracking-[-0.01em] sm:text-[30px] md:text-[34px] ${light ? "text-white" : "text-ink"}`}
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
  const styles = {
    dark: "bg-black text-white hover:bg-accent",
    light: "bg-white text-ink hover:bg-accent hover:text-white",
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
export function PageBanner({ title, subtitle, image }: { title: string; subtitle?: string; image?: string }) {
  return (
    <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-black text-center md:min-h-[340px]">
      {image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />}
      {image && <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" aria-hidden />}
      <div className="relative z-10 px-5 py-16 md:py-20">
        <h1 className="text-[30px] font-medium capitalize leading-[1.2] tracking-[-0.01em] text-white sm:text-[34px] md:text-[44px]">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-[680px] text-[15px] leading-[1.7] text-white/85 md:text-[16px]">{subtitle}</p>}
      </div>
    </section>
  );
}

/** Breadcrumb in the Houzez style: "⌂ Home > Page" */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[12px] text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
        </li>
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-1.5">
            <span aria-hidden>›</span>
            {i.href ? (
              <Link href={i.href} className="transition-colors hover:text-ink">
                {i.label}
              </Link>
            ) : (
              <span className="text-ink">{i.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
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
}: {
  href: string;
  image: string;
  title: string;
  text: string;
  tone?: "mist" | "white";
  aspect?: string;
}) {
  return (
    <Link
      href={href}
      className={`group block h-full overflow-hidden rounded-[2px] transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,0.09)] ${tone === "mist" ? "bg-mist" : "border border-line bg-white"}`}
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 350px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="px-4 pb-7 pt-6 text-center">
        <h3 className="text-[18px] uppercase tracking-[0.04em] text-ink transition-colors duration-300 group-hover:text-accent md:text-[20px]">{title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.6] text-body">{text}</p>
      </div>
    </Link>
  );
}
