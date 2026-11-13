import Image from "next/image";
import Link from "next/link";
import { footerColumns, site } from "@/lib/site";
import { SocialIcon } from "./icons";
import ScrollTop from "./ScrollTop";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr] lg:gap-x-8">
        <div className="lg:row-span-2">
          <Image
            src="/wp-content/uploads/2020/06/logo-prestige-black-1x.png"
            alt={site.name}
            width={140}
            height={46}
            className="mx-auto mb-3 h-auto w-[140px] md:mx-0 md:ml-12"
          />
          <p className="text-[14px] leading-[1.6] text-body">{site.about}</p>
          <ul className="mt-6 space-y-2.5 text-[14px]">
            <li className="flex gap-2">
              <PinIcon />
              <span>{site.address}</span>
            </li>
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 hover:text-accent">
                <PhoneIcon />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-accent">
                <MailIcon />
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-[17px] font-normal uppercase text-ink">{col.title}</h3>
            <ul className="space-y-[9px]">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="group flex items-center gap-1.5 text-[14px] text-body hover:text-accent">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
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
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-5 py-6 text-[14px] md:flex-row">
          <p>© {site.name} - All rights reserved</p>
          <ul className="flex items-center gap-4">
            {site.socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="text-body hover:text-accent">
                  <SocialIcon name={s.name} />
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
