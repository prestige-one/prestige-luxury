import Media from "@/components/Media";
import Link from "next/link";
import { footerColumns, site } from "@/lib/site";
import { SocialIcon } from "./icons";
import ScrollTop from "./ScrollTop";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-16 md:grid-cols-2 md:gap-x-8 md:py-20 lg:grid-cols-[1fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-2 lg:col-span-1 lg:row-span-2">
          <Media
            src={site.logoBlack}
            alt={site.name}
            width={438}
            height={82}
            className="mb-5 h-auto w-[200px] md:ml-12"
          />
          <p className="max-w-[420px] text-[14px] leading-[1.7] text-body">{site.about}</p>
          <ul className="mt-6 space-y-2.5 text-[14px]">
            <li className="flex gap-2">
              <PinIcon />
              <span>{site.address}</span>
            </li>
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 transition-colors hover:text-accent">
                <PhoneIcon />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 break-all transition-colors hover:text-accent">
                <MailIcon />
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-[15px] font-normal uppercase tracking-[0.06em] text-ink md:text-[17px]">{col.title}</h3>
            <ul className="space-y-[9px]">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="group flex items-start gap-1.5 py-0.5 text-[13.5px] leading-[1.5] text-body transition-colors duration-200 hover:text-accent md:text-[14px]">
                    <svg className="mt-[6px] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-smoke">
        {/* The floating WhatsApp + scroll-top stack sits over the bottom-right of the viewport, so
            this bar keeps clear of it: extra bottom space while the row is stacked (mobile), and a
            right-hand gutter once the socials move to the right edge (md+). */}
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-5 pb-36 pt-6 text-[14px] md:flex-row md:pb-6 md:pe-[92px]">
          <p className="text-center text-[13px] text-body md:text-[14px]">© {site.name} - All rights reserved</p>
          {/* Solid dark discs: the old low-opacity outlines were barely visible on the light bar. */}
          <ul className="flex items-center gap-2.5">
            {site.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${s.name}`}
                  className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-[background-color,translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_8px_18px_rgba(131,90,90,0.35)] focus-visible:bg-accent motion-reduce:transition-none"
                >
                  <SocialIcon name={s.name} size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ScrollTop />
    </footer>
  );
}

const PinIcon = () => (
  <svg className="mt-1 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 9h4M7 13h2" />
  </svg>
);
const MailIcon = () => (
  <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3 6 9 7 9-7" />
  </svg>
);
