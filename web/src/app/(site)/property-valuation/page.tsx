import type { Metadata } from "next";
import Link from "next/link";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import Media from "@/components/Media";
import { propertyTypeOptions } from "@/components/info/options";
import { Button, Container } from "@/components/ui";
import ContactPhoneItems from "@/components/ContactPhoneItems";

const title = "Book a Property Valuation";
const description = "Understand your Dubai property's sale or rental potential. Request a complimentary market appraisal with a Prestige Luxury community specialist.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/property-valuation/" },
  openGraph: { title, description, url: "/property-valuation/" },
};

const fields: LeadField[] = [
  { name: "valuation_purpose", label: "I would like a valuation for", type: "select", options: ["Selling", "Renting", "Selling and renting"], required: true },
  { name: "property_type", label: "Property type", type: "select", options: propertyTypeOptions, required: true, half: true },
  { name: "bedrooms", label: "Bedrooms", type: "select", options: ["Studio", "1", "2", "3", "4", "5", "6+", "Not applicable"], required: true, half: true },
  { name: "community", label: "Community / area", required: true, half: true },
  { name: "building", label: "Building / development (optional)", half: true },
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email address", type: "email", required: true, half: true },
  { name: "phone", label: "Phone number", type: "tel", required: true, half: true },
  { name: "contact_preference", label: "Preferred contact method", type: "select", options: ["Phone call", "WhatsApp", "Email"], required: true },
  { name: "message", label: "Anything else? (optional)", type: "textarea" },
];

const steps = [
  { title: "Tell us about your property", text: "Share the location, property type and whether you are considering selling or renting." },
  { title: "Speak with a community specialist", text: "Our team will contact you to discuss the property and arrange a suitable time for an appraisal." },
  { title: "Plan your next move", text: "Review an indicative market range and a recommended approach to bringing your property to market." },
];

export default function PropertyValuationPage() {
  return (
    <>
      <section className="bg-black py-12 text-white md:py-16">
        <Container>
          <div className="grid items-center gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/75">Your property. A clearer perspective.</p>
              <h1 className="mt-4 max-w-[600px] text-[34px] font-medium leading-[1.18] tracking-[-0.025em] text-white md:text-[46px]">Book a Property Valuation</h1>
              <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-white/85">Considering selling or renting in Dubai? Get a clearer view of your property’s market potential with a complimentary appraisal from a community specialist.</p>
              <a href="#valuation-request" className="mt-7 inline-flex min-h-12 items-center border-b border-white/60 focus-visible:outline-white text-[14px] font-medium text-white">Request your valuation <span aria-hidden className="ml-4">↓</span></a>
              <p className="mt-4 text-[12px] text-white/75">Complimentary appraisal · No obligation to list</p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[8px]">
              <Media src="/images/dubai-waterfront-cta.webp" alt="Dubai waterfront residences overlooking the marina" fill priority sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16" aria-labelledby="valuation-form-title">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="font-medium text-ink text-section">Local knowledge.<br />A considered appraisal.</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-muted">Your property’s location, layout, condition and current market activity all inform its value. We help you understand how those details shape a realistic sale or rental strategy.</p>
            <ol className="mt-8 divide-y divide-line border-y border-line">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4 py-6">
                  <span aria-hidden className="pt-0.5 text-[13px] text-muted">0{index + 1}</span>
                  <div><h3 className="text-[15px] font-medium text-ink">{step.title}</h3><p className="mt-2 text-[14px] leading-relaxed text-muted">{step.text}</p></div>
                </li>
              ))}
            </ol>
            <p className="mt-7 text-[14px] text-body">Prefer to speak to us?</p>
            <ul className="pl-valuation-contact-phones mt-2 space-y-1">
              <ContactPhoneItems className="inline-flex min-h-11 items-center gap-3 text-[18px] font-medium text-ink underline decoration-line underline-offset-4 transition-opacity hover:opacity-65" />
            </ul>
          </div>

          <div id="valuation-request" className="scroll-mt-28 rounded-[8px] border border-black bg-black p-6 text-white sm:p-10">
            <h2 id="valuation-form-title" className="font-medium text-white text-section">Tell us about your property</h2>
            <p className="mb-6 mt-2 text-[14px] leading-relaxed text-white/75">Send your request and our team will contact you to confirm the next steps. An appointment is confirmed once we agree a time with you.</p>
            <LeadForm form="Property Valuation" fields={fields} submitLabel="Request a Property Valuation" showLabels dark whiteInputs />
            <p className="mt-5 text-[12px] leading-relaxed text-white/75">We’ll use your details to respond to your valuation enquiry. Read our <Link href="/privacy-policy/" className="underline underline-offset-2 focus-visible:outline-white">Privacy Policy</Link>.</p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="pl-valuation-coverage-title" className="pl-valuation-coverage border-t border-white/15 bg-black py-12 text-white">
        <Container className="max-w-[860px]">
          <h2 id="pl-valuation-coverage-title" className="text-[20px] font-medium text-white">What does the valuation cover?</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-white/85">We discuss the property’s sale or rental potential, relevant market comparisons and practical steps to prepare for listing. The appraisal is an indicative market opinion; the final price depends on market conditions and buyer or tenant interest.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/75">If you need a formal valuation for a mortgage or another official purpose, please let us know so we can discuss the appropriate next step.</p>
          <Button href="/contact-us/" variant="light" className="mt-6">Contact Us</Button>
        </Container>
      </section>
    </>
  );
}
