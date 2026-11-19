import Link from "next/link";
import { Container } from "@/components/ui";

const reasons = [
  {
    title: "Local Market Expertise",
    text: "Community specialists help you understand Dubai’s neighbourhoods, compare properties and make an informed choice.",
    icon: <><circle cx="24" cy="19" r="11" /><path d="m18 29-3 13 9-5 9 5-3-13M19 19l3 3 7-7M24 3V1M10 7 7 4M38 7l3-3" /></>,
  },
  {
    title: "Personalised Guidance",
    text: "Your lifestyle, budget and plans come first. We tailor our recommendations to what matters to you.",
    icon: <><circle cx="24" cy="13" r="7" /><path d="M10 42v-5a14 14 0 0 1 28 0v5M5 16l3 3 5-6M35 10h8M39 6v8" /></>,
  },
  {
    title: "Considered Property Marketing",
    text: "For owners, professional photography, targeted promotion and dedicated sales expertise help your property reach potential buyers and tenants.",
    icon: <><path d="m5 17 28-9v27L5 26v-9ZM33 17l9-3v15l-9-3M10 28l4 13h7l-4-11M39 5l4-3M41 36l4 3" /></>,
  },
  {
    title: "Support Through Every Step",
    text: "From viewings and negotiations to paperwork and handover, our advisors and sales progression team keep you moving forward.",
    icon: <><path d="m5 23 19-16 19 16M10 19v23h28V19M19 42V29h10v13" /><path d="m18 20 4 4 8-8" /></>,
  },
];

export default function WhyPrestige() {
  return (
    <section id="pl-why-prestige" aria-labelledby="pl-why-prestige-title" className="pl-why-prestige scroll-mt-20 border-t border-line bg-[#fcfcfc] py-14 text-black">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.35fr] lg:gap-20">
          <div data-pl-reveal className="pl-why-intro">
            <h2 id="pl-why-prestige-title" className="text-[26px] font-medium leading-[1.25] tracking-[-0.025em] text-black md:text-[30px]">Why Choose Prestige Luxury</h2>
            <div className="mt-5 space-y-5 text-[14px] leading-[1.9] text-black/75">
              <p>A property decision is personal. You deserve an advisor who understands Dubai’s communities, takes the time to understand you, and stays involved through the details.</p>
              <p>Whether you are buying, renting or selling, we bring local knowledge and personal commitment together to help you move forward with clarity and confidence.</p>
            </div>
            <div className="pl-why-actions mt-7 flex flex-col items-start gap-3">
              <Link href="/contact-us/" className="group inline-flex min-h-11 items-center justify-between gap-6 border-b border-black pb-1 text-[13px] font-medium text-black transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black motion-reduce:transition-none">Speak to a Property Specialist <span aria-hidden="true" className="text-[18px] transition-transform group-hover:translate-x-1 motion-reduce:transition-none">↗</span></Link>
              <Link href="/about/" className="inline-flex min-h-11 items-center text-[13px] text-black/70 transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black motion-reduce:transition-none">Know more about Prestige Luxury</Link>
            </div>
          </div>

          <ul data-pl-reveal-group className="pl-why-reasons divide-y divide-black/10 border-b border-black/10">
            {reasons.map((reason, index) => (
              <li key={reason.title} className="pl-why-reason grid grid-cols-[32px_1fr] items-start gap-4 py-5 sm:grid-cols-[36px_1fr_24px] sm:gap-6 lg:py-4">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 text-black">{reason.icon}</svg>
                <div>
                  <h3 className="text-[17px] font-medium leading-[1.5] tracking-[-0.015em] text-black">{reason.title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.85] text-black/75">{reason.text}</p>
                </div>
                <span aria-hidden="true" className="hidden pt-1 text-right text-[11px] tracking-[0.08em] text-black/35 sm:block">0{index + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
