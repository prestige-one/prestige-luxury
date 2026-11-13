import type { Metadata } from "next";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import { SocialIcon } from "@/components/icons";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = seoMetadata(getPage("/contact-us/")!);

const fields: LeadField[] = [
  { name: "first_name", label: "First Name", required: true, half: true },
  { name: "last_name", label: "Last Name", required: true, half: true },
  { name: "phone", label: "Mobile", type: "tel", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "message", label: "Message", type: "textarea", required: true },
];

export default function ContactPage() {
  return (
    <>
      <section className="py-16 md:py-[100px]">
        <Container className="grid gap-12 md:grid-cols-[67%_1fr] md:gap-[3%]">
          <div>
            <h1 className="mb-8 text-[34px] font-normal uppercase text-ink md:text-[42px]">Get in Touch</h1>
            <LeadForm form="Contact" fields={fields} />
          </div>

          <aside className="space-y-8 text-[15px] text-body">
            <div>
              <h2 className="mb-3 text-[16px] font-medium text-ink">For Enquiries contact:</h2>
              <ul className="space-y-2">
                <li>
                  <a href={site.phoneHref} className="inline-flex items-center gap-3 hover:text-accent">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                    </svg>
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-accent">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-3 text-[16px] font-medium text-ink">Corporate Headquarters:</h2>
              <address className="not-italic leading-[1.7]">
                {site.name}
                <br />
                {site.address}
              </address>
            </div>
            <ul className="flex gap-2">
              {site.socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-accent"
                  >
                    <SocialIcon name={s.name} />
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>

      <section aria-label="Map" className="h-[450px] bg-mist">
        <iframe
          src="https://www.google.com/maps?q=Marina+Plaza+Dubai+Marina&output=embed"
          title="Prestige Luxury Real Estate office location – Marina Plaza, Dubai Marina"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
