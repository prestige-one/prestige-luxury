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
    <section aria-labelledby="why-prestige-title" className="bg-black py-14 text-white md:py-20">
      <Container className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/65">The Prestige Advantage</p>
          <h2 id="why-prestige-title" className="mt-3 font-medium leading-[1.2] tracking-[-0.025em] text-white text-section">Why Choose Prestige Luxury</h2>
          <p className="mt-5 text-[14px] leading-[1.85] text-white/80">A property decision is personal. You deserve an advisor who understands Dubai’s communities, takes the time to understand you, and stays involved through the details.</p>
          <p className="mt-4 text-[14px] leading-[1.85] text-white/80">Whether you are buying, renting or selling, we bring local knowledge and personal commitment together to help you move forward with clarity and confidence.</p>
          <div className="mt-6 flex flex-col items-start gap-2">
            <Link href="/contact-us/" className="inline-flex min-h-11 items-center gap-3 border-b border-white/50 text-[13px] font-medium text-white transition-opacity hover:opacity-70 focus-visible:outline-white motion-reduce:transition-none">Speak to a Property Specialist <span aria-hidden="true">↗</span></Link>
            <Link href="/about/" className="inline-flex min-h-11 items-center text-[13px] text-white/75 transition-colors hover:text-white focus-visible:outline-white motion-reduce:transition-none">Get to know Prestige</Link>
          </div>
        </div>
        <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2 md:gap-y-10">
          {reasons.map((reason) => (
            <li key={reason.title}>
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mb-4 text-white">{reason.icon}</svg>
              <h3 className="text-[18px] font-medium leading-snug text-white">{reason.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.8] text-white/80">{reason.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
