import type { Metadata } from "next";
import Media from "@/components/Media";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import { Button, Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = seoMetadata(getPage("/services/market-appraisal/")!);

const fields: LeadField[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "phone", label: "Phone", type: "tel", required: true, half: true },
  { name: "address", label: "Address" },
  { name: "message", label: "Message", type: "textarea" },
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-[14.5px] leading-[1.7] text-body marker:text-ink">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export default function MarketAppraisalPage() {
  return (
    <>
      {/* Hero with enquiry form */}
      <section id="contact" className="scroll-mt-20 bg-black py-16 md:py-[100px]">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_480px]">
          <div className="text-white">
            <h1 className="text-[34px] font-medium leading-tight md:text-[46px]">Book your free market appraisal today</h1>
            <p className="mt-4 text-[17px] text-white/80">It’s easy, free, confidential and no obligation!</p>
          </div>
          <div className="bg-white p-6 sm:p-10">
            <h2 className="font-heading text-[26px] text-ink">Get In Touch</h2>
            <p className="mb-6 mt-2 text-[14px] text-muted">Fill out this form and one of our experts will be in touch with you soon.</p>
            <LeadForm form="Market Appraisal" fields={fields} />
            <p className="mt-4 text-[12px] text-muted">
              By submitting this form you consent to having this website store your submitted information.
            </p>
          </div>
        </Container>
      </section>

      {/* What is a market appraisal */}
      <section className="py-16 md:py-[100px]">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[2px] text-accent">What’s my house worth? Ask us today.</p>
            <h2 className="mt-3 text-[28px] font-medium text-ink md:text-[32px]">What Is A Market Appraisal?</h2>
            <p className="mt-4 text-[14.5px] leading-[1.8] text-body">
              <strong className="font-semibold text-ink">We provide a thorough and considered assessment of your property.</strong> You
              will receive a full report based on ACTUAL comparable sales for your home. This will give you a realistic range on which to
              base your expectations, but doesn’t limit what you can achieve.
            </p>
            <p className="mt-5 text-[14.5px] font-semibold text-ink">What’s included in your appraisal?</p>
            <Bullets
              items={[
                "A current market assessment based on actual comparable sales in your area",
                "A full breakdown of the sales process and how it works",
                "A detailed marketing plan, specific to your property",
                "An explanation of any costs that might be involved in the selling of your property",
              ]}
            />
            <Button href="#contact" className="mt-8">
              Request your free quote now
            </Button>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Media src="/wp-content/uploads/2020/09/MA-PRE.jpg" alt="Market appraisal of a Dubai property" fill sizes="(min-width: 768px) 550px, 100vw" className="object-cover" />
          </div>
        </Container>
      </section>

      {/* Client quote */}
      <section className="relative overflow-hidden bg-black">
        <Media src="/wp-content/uploads/2020/07/11E20A0779.jpg" alt="" fill tone="ink" sizes="100vw" className="object-cover opacity-40" />
        <Container className="relative z-10 py-16 text-center text-white md:py-[100px]">
          <figure className="mx-auto max-w-[860px]">
            <blockquote className="text-[20px] font-light italic leading-[1.6] md:text-[24px]">
              “I would like to thank your company for your professional selection of the sales team. Really it was my pleasure to deal with
              you and i will do recommend always your company to all my friends and family members. Thanks Again.”
            </blockquote>
            <figcaption className="mt-6 text-[16px] font-medium">– Ayman Sharaf</figcaption>
          </figure>
        </Container>
      </section>

      {/* Right advice upfront */}
      <section className="py-16 md:py-[100px]">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden md:order-2">
            <Media
              src="/wp-content/uploads/elementor/thumbs/DSC_6050-Small-scaled-rra8yos467v7l49f4siec7v217jojgv90pazckhe3k.jpg"
              alt="Luxury apartment interior in Dubai Marina"
              fill
              sizes="(min-width: 768px) 550px, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[2px] text-accent">Get the right advice upfront</p>
            <h2 className="mt-3 text-[28px] font-medium text-ink md:text-[32px]">What else can a market appraisal tell me?</h2>
            <p className="mt-4 text-[14.5px] font-semibold text-ink">We’ll also cover questions like:</p>
            <Bullets
              items={[
                "When is the best time to sell?",
                "How long will it take to sell my house?",
                "What renovations or work will add the most value prior to selling?",
                "Who can I use to help prepare my house for sale?",
                "How do I present my home to appeal to the widest possible market?",
                "How can we create competition amongst buyers?",
                "What method of sale: Auction, Tender, Buyer Enquiry Over or Price By Negotiation, will get you the best price?",
              ]}
            />
            <Button href="#contact" className="mt-8">
              Request your free quote now
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
