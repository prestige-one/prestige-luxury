import type { Metadata } from "next";
import ConsentEmbed from "@/components/cookies/ConsentEmbed";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import { SocialIcon } from "@/components/icons";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { site } from "@/lib/site";
import ContactPhoneItems from "@/components/ContactPhoneItems";

export const metadata: Metadata = seoMetadata(getPage("/contact-us/")!);

const fields: LeadField[] = [
  { name: "first_name", label: "First Name", required: true, half: true },
  { name: "last_name", label: "Last Name", required: true, half: true },
  { name: "phone", label: "Mobile", type: "tel", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "message", label: "Message", type: "textarea", required: true },
];

const contactSocials = [...site.socials, { name: "WhatsApp", href: site.whatsappHref }];
const brandHover: Record<string, string> = {
  Facebook: "hover:bg-[#1877f2] focus-visible:bg-[#1877f2]",
  Instagram: "hover:bg-[linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)] focus-visible:bg-[linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)]",
  LinkedIn: "hover:bg-[#0a66c2] focus-visible:bg-[#0a66c2]",
  YouTube: "hover:bg-[#ff0000] focus-visible:bg-[#ff0000]",
  X: "hover:bg-white hover:text-black hover:ring-1 hover:ring-black focus-visible:bg-white focus-visible:text-black focus-visible:ring-1 focus-visible:ring-black",
  WhatsApp: "hover:bg-[#25d366] focus-visible:bg-[#25d366]",
};

export default function ContactPage() {
  return (
    <>
      <section className="py-16 md:py-[100px]">
        <Container className="grid gap-x-12 gap-y-8 md:grid-cols-[67%_1fr] md:gap-x-[3%]">
          <h1 className="text-[34px] font-normal uppercase text-ink md:col-span-2 md:text-[42px]">Get in Touch</h1>
          <div>
            <LeadForm form="Contact" fields={fields} showLabels />
          </div>

          <aside className="space-y-8 text-[15px] text-body">
            <div>
              <h2 className="mb-3 text-[16px] font-medium text-ink">For enquiries, please contact:</h2>
              <ul className="space-y-2">
                <ContactPhoneItems />
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
            <ul aria-label="Contact social links" className="flex flex-wrap gap-2">
              {contactSocials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors motion-reduce:transition-none ${brandHover[s.name]}`}
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
        <ConsentEmbed
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
