import type { Metadata } from "next";
import Script from "next/script";
import { QuoteCard, SnapRow } from "@/components/info/blocks";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = seoMetadata(getPage("/testimonials/")!);

// The original page shows live Google/Facebook reviews through an Elfsight widget (id below).
// The quotes underneath are the client testimonials published elsewhere on the original site.
const ELFSIGHT_APP = "elfsight-app-6f176c59-949e-42ee-818b-d9af5d8c35d5";

const quotes = [
  {
    quote:
      "I would like to thank your company for your professional selection of the sales team. Really it was my pleasure to deal with you and i will do recommend always your company to all my friends and family members. Thanks Again.",
    name: "Ayman Sharaf",
    role: "Client",
  },
  {
    quote: "My property had been managed by prestige for 2 years now. Service and communication is always amazing",
    name: "Hilary Leigh",
    role: "Landlord",
  },
  {
    quote:
      "Prestige property management had helped me alot as an owner who doesn’t live in Dubai. They manage your property like it’s their own. Would highly recommend",
    name: "Quintin Angus",
    role: "Landlord",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream py-[90px] text-center md:py-[120px]">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-[64px] font-black uppercase leading-none tracking-[6px] text-[#ece7d0] md:text-[180px] md:tracking-[30px] lg:text-[240px]"
        >
          Reviews
        </p>
        <h1 className="relative text-[40px] font-bold uppercase tracking-[3px] text-ink md:text-[68px] md:tracking-[10px]">Testimonials</h1>
      </section>

      <section className="py-[70px] md:py-[90px]">
        <Container>
          <div className={ELFSIGHT_APP} data-elfsight-app-lazy />
          <Script src="https://apps.elfsight.com/p/platform.js" strategy="lazyOnload" />

          <h2 className="mb-8 mt-14 text-center font-heading text-[28px] text-ink md:text-[34px]">What our clients say</h2>
          <SnapRow>
            {quotes.map((q) => (
              <div key={q.name} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
                <QuoteCard {...q} />
              </div>
            ))}
          </SnapRow>
        </Container>
      </section>
    </>
  );
}
