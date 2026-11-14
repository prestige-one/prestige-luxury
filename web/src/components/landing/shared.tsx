// Building blocks shared by the standalone project landing pages (black Elementor "canvas" design).
import Media from "@/components/Media";
import Link from "next/link";
import type { LeadField } from "@/components/LeadForm";
import { site } from "@/lib/site";
import { countries } from "./countries";

/**
 * Contact details used on the landing pages. The campaign email is still separate (leads@),
 * but the phone number is the agency's single published one — the owner asked for that number
 * everywhere, so the old 446 8300 campaign line is gone.
 */
export const landingContact = {
  email: "leads@prestigeluxury.ae",
  phoneHref: site.phoneHref,
  whatsapp: site.whatsappHref,
};

export const LOGO_WHITE = { src: "/wp-content/uploads/2022/11/Prestige-Luxury-Logo-30-px-white.png", width: 199, height: 63 };

/** Fields of the project enquiry form (Name, Email, Country, Phone) */
export function projectFields(lang: "en" | "ar" = "en"): LeadField[] {
  const ar = lang === "ar";
  return [
    { name: "name", label: ar ? "الاسم" : "Name", required: true },
    { name: "email", label: ar ? "البريد الإلكتروني" : "Email", type: "email", required: true },
    { name: "country", label: ar ? "الدولة" : "Select Country", type: "select", options: countries, required: true },
    { name: "phone", label: ar ? "رقم الهاتف" : "Phone", type: "tel", required: true },
  ];
}

/** Fields of the Houzez contact form used on /projects-for-sale/ */
export const contactFields: LeadField[] = [
  { name: "first_name", label: "First Name", required: true, half: true },
  { name: "last_name", label: "Last Name", required: true, half: true },
  { name: "phone", label: "Mobile", type: "tel", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "message", label: "Message", type: "textarea", required: true },
];

/** Button styles taken from the Elementor CSS */
export const btn = {
  /** white pill, black uppercase text (Orra / Vista / The Residence) */
  pill: "pl-lp-button inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-[13px] font-semibold uppercase tracking-[2px] text-black transition-colors hover:bg-accent hover:text-white sm:px-[50px] sm:py-5 sm:text-[15px]",
  /** white, 15px radius, bold (Prestige Embankment "Learn More", thank-you pages) */
  white:
    "pl-lp-button inline-flex items-center justify-center rounded-[15px] bg-white px-7 py-3 text-[20px] font-bold leading-tight text-black transition-colors hover:bg-accent hover:text-white md:text-[26px]",
  /** black, 15px radius */
  black:
    "pl-lp-button inline-flex items-center justify-center rounded-[15px] border border-white/10 bg-[#020101] px-5 py-2 text-[18px] font-bold leading-[40px] text-white transition-colors hover:bg-accent md:text-[22px]",
  /** grey, 15px radius */
  grey: "pl-lp-button inline-flex items-center justify-center rounded-[15px] bg-[#A3A3A3] px-5 py-2 text-[18px] font-bold leading-[40px] text-black transition-colors hover:bg-white md:text-[22px]",
};

/** White header shared by standalone campaign pages. */
export function LogoBar({ action }: { action?: React.ReactNode }) {
  return (
    <header className="pl-landing-header border-b border-line bg-white py-[15px] text-black">
      <div className="flex items-center justify-between px-5 md:px-[100px]">
        <Media src={site.logoBlack} alt="Prestige Luxury Real Estate" width={438} height={82} priority className="h-auto w-[150px] md:w-[199px]" />
        {action}
      </div>
    </header>
  );
}

/** Big white section heading (Mulish 800) */
export function LpHeading({
  children,
  as: Tag = "h2",
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  dark?: boolean;
}) {
  return (
    <Tag
      className={`pl-lp-heading text-center text-[32px] font-extrabold leading-[1.25] md:text-[48px] lg:text-[64px] ${dark ? "text-black" : "text-white"} ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Elementor "image-box": icon next to (or above) a title */
export function IconBox({
  icon,
  title,
  text,
  href,
  stacked = false,
  className = "",
  iconClass = "w-[46px]",
}: {
  icon: { src: string; width: number; height: number };
  title: React.ReactNode;
  text?: React.ReactNode;
  href?: string;
  stacked?: boolean;
  className?: string;
  iconClass?: string;
}) {
  const body = (
    <>
      <Media src={icon.src} alt="" width={icon.width} height={icon.height} className={`h-auto shrink-0 ${iconClass}`} />
      <span className={stacked ? "mt-3 block" : "block"}>
        <span className="block">{title}</span>
        {text && <span className="block">{text}</span>}
      </span>
    </>
  );
  const cls = `${stacked ? "flex flex-col items-center text-center" : "flex items-center gap-4"} ${className}`;
  if (!href) return <div className={cls}>{body}</div>;
  return /^(https?:|mailto:|tel:)/.test(href) ? (
    <a href={href} className={`${cls} transition-opacity hover:opacity-75`} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
      {body}
    </a>
  ) : (
    <Link href={href} className={`${cls} transition-opacity hover:opacity-75`}>
      {body}
    </Link>
  );
}

const contactIcons = {
  email: { src: "/wp-content/uploads/2023/04/envelope-lines.png", width: 40, height: 40 },
  phone: { src: "/wp-content/uploads/2023/04/call.png", width: 33, height: 34 },
  whatsapp: { src: "/wp-content/uploads/2023/04/Group-18.png", width: 41, height: 39 },
};

export function ContactLinks({ lang = "en", className = "" }: { lang?: "en" | "ar"; className?: string }) {
  const ar = lang === "ar";
  const t = "pl-lp-footer-link text-[20px] font-light leading-[2.6] text-white md:text-[24px]";
  return (
    <div className={className}>
      <IconBox icon={contactIcons.email} iconClass="w-[30px]" title={ar ? "البريد الإلكتروني" : "Email"} href={`mailto:${landingContact.email}`} className={t} />
      <IconBox icon={contactIcons.phone} iconClass="w-[30px]" title={ar ? "رقم الهاتف" : "Phone"} href={landingContact.phoneHref} className={t} />
      <IconBox icon={contactIcons.whatsapp} iconClass="w-[30px]" title={ar ? "واتس آب" : "Whatsapp"} href={landingContact.whatsapp} className={t} />
    </div>
  );
}

function Copyright({ year = true }: { year?: boolean }) {
  return (
    <p className="text-center text-[16px] font-medium md:text-[24px]" dir="ltr">
      © Prestige Luxury Real Estate – {year ? `${new Date().getFullYear()} – ` : ""}All rights reserved
    </p>
  );
}

/** Footer of the Orra / Vista / The Residence pages: logo, copyright, contact links in a row */
export function SimpleFooter({ privacy = true }: { privacy?: boolean }) {
  return (
    <footer className="border-t-[3px] border-white px-5 pb-10 pt-10 md:px-[100px]">
      <Media src={LOGO_WHITE.src} alt="Prestige Luxury Real Estate" tone="ink" width={LOGO_WHITE.width} height={LOGO_WHITE.height} className="mx-auto h-auto w-[199px]" />
      <div className="mt-6">
        <Copyright />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-1">
        <ContactLinks className="contents" />
        {privacy && (
          <Link href="/privacy-policy/" className="text-[20px] font-light leading-[2.6] text-white hover:opacity-75 md:text-[24px]">
            Privacy Policy
          </Link>
        )}
      </div>
    </footer>
  );
}

/** Footer of the thank-you pages: logo + copyright */
export function MiniFooter() {
  return (
    <footer className="px-5 pb-10 md:px-[100px]">
      <Media src={LOGO_WHITE.src} alt="Prestige Luxury Real Estate" tone="ink" width={LOGO_WHITE.width} height={LOGO_WHITE.height} className="mx-auto h-auto w-[199px]" />
      <div className="mt-6">
        <Copyright />
      </div>
    </footer>
  );
}

const quickLinkIcons = {
  projects: { src: "/wp-content/uploads/2023/04/petronas-towers.png", width: 42, height: 42 },
  benefits: { src: "/wp-content/uploads/2023/04/star-badge-award.png", width: 42, height: 42 },
  map: { src: "/wp-content/uploads/2023/04/house-pin-location.png", width: 42, height: 42 },
  lifestyle: { src: "/wp-content/uploads/2023/04/wings-badge-star.png", width: 42, height: 42 },
  testimonials: { src: "/wp-content/uploads/2023/04/star-rating-banner.png", width: 42, height: 42 },
};
export type QuickLink = { key: keyof typeof quickLinkIcons; label: string; href?: string };

/** Footer with "Quick Links" + "Contact Us" columns (Prestige Embankment, Projects for Sale) */
export function LinksFooter({ links, lang = "en", year = true }: { links: QuickLink[]; lang?: "en" | "ar"; year?: boolean }) {
  const t = "pl-lp-footer-link text-[20px] font-light leading-[2.6] text-white md:text-[24px]";
  return (
    <footer className="border-t-[3px] border-white px-5 pb-10 pt-12 md:px-[100px]">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <h2 className="text-[26px] font-medium md:text-[32px]">Quick Links</h2>
          <div className="mt-2 grid grid-cols-2 gap-x-12">
            {links.map((l) => (
              <IconBox key={l.key} icon={quickLinkIcons[l.key]} iconClass="w-[30px]" title={l.label} href={l.href} className={t} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-[26px] font-medium md:text-[32px]">Contact Us</h2>
          <ContactLinks lang={lang} className="mt-2" />
        </div>
      </div>
      <Media src={LOGO_WHITE.src} alt="Prestige Luxury Real Estate" tone="ink" width={LOGO_WHITE.width} height={LOGO_WHITE.height} className="mx-auto mt-12 h-auto w-[199px]" />
      <div className="mt-6">
        <Copyright year={year} />
      </div>
    </footer>
  );
}

/** Black box with a 3px white border and 15px radius that holds the enquiry form */
export function FormBox({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`pl-lp-form mx-auto w-full max-w-[560px] rounded-[15px] border-[3px] border-white bg-black p-6 sm:p-[50px] ${className}`}>
      <h2 className="mb-6 text-center text-[32px] font-extrabold leading-tight md:text-[48px]">{title}</h2>
      {children}
    </div>
  );
}

export type Review = { name: string; text: string };

/** "What our Clients are Saying" – white section with quote marks and three testimonials */
export function Reviews({ title, reviews, id }: { title: string; reviews: Review[]; id?: string }) {
  const quote = "/wp-content/uploads/2023/04/unnamed-file.png";
  return (
    <section id={id} className="bg-white px-5 pb-20 pt-16 text-black md:px-[100px] md:pb-[100px]">
      <Media src={quote} alt="" width={144} height={116} className="mx-auto h-auto w-[72px]" />
      <LpHeading dark className="mt-6">
        {title}
      </LpHeading>
      <div className="mx-auto mt-12 grid max-w-[1400px] gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="flex flex-col rounded-[15px] border border-black/15 p-6 md:p-8">
            <figcaption className="text-[20px] font-bold">{r.name}</figcaption>
            <blockquote className="mt-4 flex-1 whitespace-pre-line text-[15px] leading-[1.7] text-body">{r.text}</blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}

const benefitIcons = [
  { src: "/wp-content/uploads/2023/04/Group-5.png", width: 98, height: 105 },
  { src: "/wp-content/uploads/2023/04/Group-7.png", width: 77, height: 119 },
  { src: "/wp-content/uploads/2023/04/Group-4.png", width: 82, height: 118 },
  { src: "/wp-content/uploads/2023/04/Group-6.png", width: 85, height: 107 },
];

/** "Attractive Payment Plans / Interest-Free Installments / 0% Property Taxes / Golden Visa" row */
export function BenefitRow({
  labels = ["Attractive Payment Plans", "Interest-Free Installments", "0% Property Taxes", "Golden Visa"],
  big = false,
  className = "",
}: {
  labels?: string[];
  big?: boolean;
  className?: string;
}) {
  return (
    <ul className={`pl-lp-benefits mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 ${className}`}>
      {labels.map((label, i) => (
        <li key={label} className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Media src={benefitIcons[i].src} alt="" width={benefitIcons[i].width} height={benefitIcons[i].height} className="h-[60px] w-[56px] shrink-0 object-contain md:h-[90px] md:w-[80px]" />
          <span className={`min-w-0 break-words font-medium leading-tight ${big ? "text-[17px] sm:text-[20px] md:text-[28px] xl:text-[32px]" : "text-[17px] sm:text-[18px] md:text-[24px]"}`}>{label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Floating WhatsApp button (projects pages) */
// The landing pages used to carry their own image-based WhatsApp float. There is now a single
// global <WhatsAppButton /> in the root layout covering every page, so this one was removed
// rather than left to sit on top of it.
