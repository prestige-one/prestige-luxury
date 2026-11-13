// Building blocks for the company/info pages (about, services, careers, contact, FAQ...).
// They recreate the Elementor widgets used on those pages as plain React + Tailwind.
import Image from "next/image";
import { Button, Container } from "@/components/ui";

/** Small eyebrow heading + big title + short black divider (Elementor "text + heading + divider") */
export function Eyebrow({ label, title, className = "", as: Tag = "h2" }: { label?: string; title: string; className?: string; as?: "h1" | "h2" }) {
  return (
    <div className={className}>
      {label && <p className="text-[15px] font-light uppercase tracking-wide text-ink">{label}</p>}
      <Tag className="mt-2 text-[34px] font-medium leading-tight text-ink md:text-[44px]">{title}</Tag>
      <span className="mt-5 block h-[2px] w-16 bg-ink" aria-hidden />
    </div>
  );
}

/** Dark banner with a background photo, used for the call-to-action blocks at the bottom of pages */
export function CtaBanner({
  image,
  title,
  lines = [],
  cta,
  overlay = "bg-black/65",
}: {
  image: string;
  title: string;
  lines?: string[];
  cta?: { label: string; href: string };
  overlay?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-black">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div className={`absolute inset-0 ${overlay}`} aria-hidden />
      <Container className="relative z-10 flex flex-col items-center gap-5 py-[120px] text-center text-white">
        <h2 className="max-w-[760px] text-[23px] font-semibold leading-snug">{title}</h2>
        {lines.map((l) => (
          <p key={l} className="max-w-[580px] text-[17px] leading-[1.45] text-white/90">
            {l}
          </p>
        ))}
        {cta && (
          <Button href={cta.href} variant="light" className="mt-3">
            {cta.label}
          </Button>
        )}
      </Container>
    </section>
  );
}

/** Accessible accordion built on <details>/<summary>; answers are HTML copied from the original page */
export function Accordion({ items, dark = false }: { items: { q: string; a: string }[]; dark?: boolean }) {
  return (
    <div className={`divide-y border ${dark ? "divide-white/15 border-white/15" : "divide-line border-line"}`}>
      {items.map((it) => (
        <details key={it.q} className="group">
          <summary
            className={`flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden ${
              dark ? "text-white hover:bg-white/5" : "text-ink hover:bg-mist"
            }`}
          >
            <span>{it.q}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 transition-transform group-open:rotate-180"
              aria-hidden
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div
            className={`wp-content px-5 pb-5 text-[14px] leading-[1.8] ${dark ? "text-white/80 [&_a]:text-white" : "text-body"}`}
            dangerouslySetInnerHTML={{ __html: it.a }}
          />
        </details>
      ))}
    </div>
  );
}

/** Check-mark list (Elementor "icon-list" with fa-check) */
export function CheckList({ items, className = "", dark = false }: { items: string[]; className?: string; dark?: boolean }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((i) => (
        <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.5]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={`mt-[3px] shrink-0 ${dark ? "text-white" : "text-ink"}`}
            aria-hidden
          >
            <path d="m4 12 5 5L20 6" />
          </svg>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

/** Quote card used for client testimonials */
export function QuoteCard({ quote, name, role }: { quote: string; name: string; role?: string }) {
  return (
    <figure className="flex h-full flex-col border border-line bg-white p-8">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-accent" aria-hidden>
        <path d="M9.6 6C6.5 7.4 4.5 10 4.5 13.6V18h5.6v-5.4H7.3c.1-2 1.2-3.6 3.2-4.6zm9 0c-3.1 1.4-5.1 4-5.1 7.6V18h5.6v-5.4h-2.8c.1-2 1.2-3.6 3.2-4.6z" />
      </svg>
      <blockquote className="mt-4 flex-1 text-[15px] italic leading-[1.8] text-body">“{quote}”</blockquote>
      <figcaption className="mt-6">
        <span className="block text-[15px] font-medium text-ink">{name}</span>
        {role && <span className="text-[13px] text-muted">{role}</span>}
      </figcaption>
    </figure>
  );
}

/** Horizontal scroll-snap row (replaces the Elementor/Swiper carousels) */
export function SnapRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:thin]">{children}</div>
  );
}

/**
 * Turns Elementor page HTML into plain rich text: drops wrappers, scripts, classes and inline styles,
 * keeps headings/paragraphs/lists/links. Used for the legal pages.
 */
export function cleanElementorHtml(html: string, { demoteH1 = true } = {}) {
  let out = html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(div|section|span|font|o:p)\b[^>]*>/gi, "")
    .replace(/\s(class|style|id|data-[\w-]+|aria-[\w-]+|role)="[^"]*"/gi, "")
    .replace(/(href|src)="https?:\/\/(www\.)?prestigeluxury\.ae(?=\/)/gi, '$1="')
    .replace(/&nbsp;/g, " ")
    .replace(/<(p|h[1-6]|li)>\s*<\/\1>/gi, "")
    .replace(/\s+/g, " ");
  if (demoteH1) out = out.replace(/<(\/?)h1>/gi, "<$1h2>");
  return out.trim();
}
