import { contactPhones, site } from "@/lib/site";

/** Shared telephone rows for the footer and contact page; both use the same contact settings. */
export default function ContactPhoneItems({ className = "inline-flex items-center gap-3 transition-opacity hover:opacity-65" }: { className?: string }) {
  return <>{contactPhones.map((phone) => <li key={phone.href} className="pl-contact-phone">
    <a href={phone.href} className={className}>
      <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {phone.href === site.officePhoneHref ? <>
          <path d="M5 10h14l3 10H2l3-10Z" /><path d="M3 9V6c0-3 18-3 18 0v3h-5V6H8v3H3Z" />
          <path d="M9 13h.01M12 13h.01M15 13h.01M9 16h.01M12 16h.01M15 16h.01" strokeLinecap="round" strokeWidth="2.5" />
        </> : <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />}
      </svg>
      <span>{phone.number}</span>
    </a>
  </li>)}</>;
}
