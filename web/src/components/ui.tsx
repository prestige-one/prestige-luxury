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
    <div className={`mx-auto mb-12 max-w-[760px] text-center ${className}`}>
      <h2 className={`font-heading text-[30px] font-normal capitalize leading-tight md:text-[34px] ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-3 text-[15px] ${light ? "text-white/80" : "text-muted"}`}>{subtitle}</p>}
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
  const cls = `inline-flex items-center justify-center px-6 py-3 text-[14px] font-medium transition-colors ${styles} ${className}`;
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
    <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-black text-center">
      {image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />}
      <div className="relative z-10 px-5 py-20">
        <h1 className="text-[34px] font-medium capitalize text-white md:text-[44px]">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-[720px] text-[16px] text-white/85">{subtitle}</p>}
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
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
        </li>
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-1.5">
            <span aria-hidden>›</span>
            {i.href ? (
              <Link href={i.href} className="hover:text-ink">
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
    <Link href={href} className={`group block h-full ${tone === "mist" ? "bg-mist" : "border border-line bg-white"}`}>
      <div className={`relative ${aspect} overflow-hidden`}>
        <Image src={image} alt={title} fill sizes="(min-width: 1024px) 350px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="px-2 pb-7 pt-6 text-center">
        <h3 className="text-[20px] uppercase text-ink">{title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.5] text-body">{text}</p>
      </div>
    </Link>
  );
}
