import type { Metadata } from "next";
import Script from "next/script";
import { CtaBanner, QuoteCard } from "@/components/info/blocks";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { featurePhoto } from "@/lib/imagery";

export const metadata: Metadata = seoMetadata(getPage("/testimonials/")!);

// The original page shows live Google/Facebook reviews through an Elfsight widget (id below).
// The quotes underneath are the client testimonials published elsewhere on the original site.
const ELFSIGHT_APP = "elfsight-app-6f176c59-949e-42ee-818b-d9af5d8c35d5";

const ctaImage = featurePhoto("Testimonials call to action", "full") ?? "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg";

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
      <section className="relative overflow-hidden bg-black py-16 text-center text-white md:py-20">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-[64px] font-black uppercase leading-none tracking-[6px] text-white/5 md:text-[140px] md:tracking-[20px]"
        >
          Reviews
        </p>
        <h1 className="relative text-[30px] font-medium tracking-[0.02em] text-white md:text-[42px]">Testimonials</h1>
      </section>

      <section className="py-[70px] md:py-[90px]">
        <Container>
          <div className={`pl-live-reviews ${ELFSIGHT_APP}`} data-elfsight-app-lazy />
          {/* The live reviews are this page's main content, so they load as soon as the page is
              interactive rather than last — on lazyOnload they took about five seconds to appear. */}
          <Script src="https://apps.elfsight.com/p/platform.js" strategy="afterInteractive" />

          <h2 className="mb-2 mt-14 text-center font-heading text-ink text-section">What our clients say</h2>
          <p className="mx-auto mb-10 max-w-[560px] text-center text-[15px] leading-[1.7] text-muted">
            Buyers, sellers, landlords and tenants on working with our sales and property management teams.
          </p>
          {/* A plain grid rather than a scroll row: three cards fit on one line, so a carousel
              only hid the second and third behind a swipe. */}
          <ul className="grid gap-6 md:grid-cols-3">
            {quotes.map((q) => (
              <li key={q.name}>
                <QuoteCard {...q} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner
        image={ctaImage}
        title="Thinking of buying, selling or letting in Dubai?"
        lines={["Speak to an advisor who works your community every day."]}
        cta={{ label: "Speak to an Advisor", href: "/contact-us/" }}
      />
    </>
  );
}
