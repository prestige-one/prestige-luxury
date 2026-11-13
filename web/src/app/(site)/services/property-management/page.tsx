import type { Metadata } from "next";
import Image from "next/image";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import { Accordion, CheckList, QuoteCard } from "@/components/info/blocks";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = seoMetadata(getPage("/services/property-management/")!);

const plans = [
  {
    name: "Basic",
    price: "3999",
    dark: false,
    features: [
      "Marketing of your property",
      "Professional photography",
      "Tenant find with accompanied viewings",
      "Tenant screening and collection of documents",
      "Preparation of Tenancy Agreement",
      "Collection of rental cheques and the security deposit",
      "Tenant welcome letter",
      "RERA compliant",
      "Pre-inspection of property with inspection report",
    ],
  },
  {
    name: "Advance",
    price: "4999",
    dark: true,
    features: [
      "ALL BASIC PLAN FEATURES +",
      "Manage Tenant move in with key handover",
      "Schedule of condition report",
      "Banking rental cheques",
      "Dedicated Property Manager",
      "Renewal of Tenancy",
      "Re-market and manage property when vacant",
      "Manage Tenant move out",
      "Float management",
      "Tenant complaints management",
      "Maintenance management",
      "Snag report and rectification advice",
      "Manage and arrange repairs",
      "Property inventory with photographs",
      "Return deposit to the tenant",
    ],
  },
  {
    name: "Prestige",
    price: "6999",
    dark: false,
    features: [
      "ALL ADVANCE PLAN FEATURES +",
      "Key holding service",
      "Financial reporting with quarterly statements",
      "Featured property listing",
      "Furnishing of property (Extra charges towards purchase of furniture, furnishings, white goods etc)",
      "Power of Attorney service (only related to the property/properties signed for management)",
      "Legal guidance",
      "Dewa connection and closure for owner",
      "Assistance with Rental Dispute Case",
      "Manage property during vacant period",
    ],
  },
];

const ic = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, "aria-hidden": true } as const;
const icons = {
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  snow: <path d="M12 2v20M4 6l16 12M20 6 4 18M9 3l3 2 3-2M9 21l3-2 3 2" />,
  truck: <path d="M2 6h12v10H2zM14 10h4l4 4v2h-8M6 19a2 2 0 1 0 0-.1M18 19a2 2 0 1 0 0-.1" />,
  thumb: <path d="M7 11v9H3v-9zM7 11l4-8a2.5 2.5 0 0 1 2.5 3L13 10h6a2 2 0 0 1 2 2.3l-1.3 6A2 2 0 0 1 17.7 20H7" />,
  medal: <path d="M8 2h8l-2 6h-4zM12 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 13.5l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 15.8l2-.3z" />,
  heart: <path d="M12 8c-1.5-3-6-3-6 .5 0 3 6 6.5 6 6.5s6-3.5 6-6.5C18 5 13.5 5 12 8ZM2 20h5l4 1h5l6-3-1-2-5 1" />,
  building: <path d="M4 21V3h11v18M15 9h5v12M2 21h20M7 7h2M11 7h1M7 11h2M11 11h1M7 15h2M11 15h1" />,
  house: <path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5" />,
  doc: <path d="M6 2h9l4 4v16H6zM14 2v5h5M9 12h7M9 16h7" />,
  couch: <path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M2 12a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v6H2zM5 18v2M19 18v2" />,
};
const oneTime: { title: string; icon: keyof typeof icons }[] = [
  { title: "One time DEWA registration", icon: "bolt" },
  { title: "One time chiller registration*", icon: "snow" },
  { title: "One time move-in assistance", icon: "truck" },
  { title: "One time inspection of a villa", icon: "thumb" },
  { title: "One time inspection of an apartment", icon: "medal" },
  { title: "One time handover from Developer", icon: "heart" },
  { title: "One time apartment snagging with Developer", icon: "building" },
  { title: "One time villa snagging with Developer", icon: "house" },
  { title: "One-time Power of Attorney service", icon: "doc" },
  { title: "One time property furnishing", icon: "couch" },
];

const faqs = [
  {
    q: "Can you guarantee me a tenant, and when ?",
    a: "<p>Nobody can guarantee you when they will find you a tenant, however we work with several specialists in Dubai to get your property rented as soon as possible</p>",
  },
  { q: "Will I get a discount if I have multiple properties?", a: "<p>Yes, we can after management approval</p>" },
  {
    q: "If I take property management will you also assist me in selling my property?",
    a: "<p>Yes, because we are not just a management company, we are also a brokerage company that specialize in renting and selling</p>",
  },
  {
    q: "Can I pay after the property gets rented?",
    a: "<p>Yes, but you will have a pay at least a minimum of AED 3000 to cover the cost of management before the property is rented.</p>",
  },
  {
    q: "What if I am not satisfied with the service, how does cancellation work?",
    a: "<p>In the unlikely event that you are unhappy with the service we provide, we will require from you a 90-day notice letter in writing giving us reason for termination. The Managing Agent agrees to refund any outstanding rental funds held after relevant deductions made to the property (such as community charges, approved payments by you (Owner).</p>",
  },
];

const fields: LeadField[] = [
  { name: "name", label: "Name", required: true },
  { name: "phone", label: "Mobile", type: "tel", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "message", label: "Message", type: "textarea" },
];

export default function PropertyManagementPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-black">
        <Image
          src="/wp-content/uploads/2020/09/PM-Cover1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#202020]/80" aria-hidden />
        <Container className="relative z-10 grid min-h-[600px] items-center gap-10 py-16 md:grid-cols-2">
          <div className="text-white">
            <h1 className="text-[38px] font-semibold leading-tight md:text-[52px]">Prestige Property Management</h1>
            <a
              href="#pricing"
              className="mt-8 inline-flex border border-white px-8 py-3 text-[14px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
            >
              Get Started
            </a>
          </div>
          <div className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl">
            <iframe
              src="https://www.youtube-nocookie.com/embed/sAU6Wu7PpKE?rel=0"
              title="Prestige Property Management"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Container>
      </section>

      {/* We care + why us */}
      <section className="bg-black text-white">
        <div className="grid md:grid-cols-[40%_60%]">
          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-8 py-16">
            <Image src="/wp-content/uploads/2020/10/Prestige-BG11.jpg" alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover opacity-60" />
            <h2 className="relative z-10 max-w-[360px] text-center text-[28px] font-semibold leading-snug">
              At Prestige Luxury Real Estate, We Care!
            </h2>
          </div>
          <div className="px-6 py-16 text-[14.5px] leading-[1.8] text-white/85 md:px-14 lg:px-20">
            <div className="max-w-[640px] space-y-4">
              <p>
                Thank you for visiting Prestige Luxury Real Estate, a property management and real estate company that delivers property
                management services with care and professionalism.
              </p>
              <p>
                Our experienced team is passionate and have a thorough understanding of the UAE rental market. We will always prioritize
                you &amp; your property needs and will always ensure that your property is managed in a most professional manner whilst
                making sure you receive the most income possible.
              </p>
              <p>
                Please take the time to go through our brochure to know the packages depending on your requirements. Once you are ready,
                you can sign up for any package by clicking the option you want and uploading the necessary documents. In turn, we will
                contact you to finalize the sign up.
              </p>
              <h2 className="pt-6 text-[30px] font-bold text-white">WHY US?</h2>
              <ul className="list-disc space-y-2 pl-5 marker:text-white">
                <li>
                  We are and want to be different from the standard management companies in the market, as we care not just for our
                  clients but for everyone related to the property we manage.
                </li>
                <li>We have a more hands on approach when it comes to managing properties as we treat them as if it were our own.</li>
                <li>We provide each property with an individual approach as each client and property is different</li>
                <li>We are knowledgeable and offer great advice to all our clients.</li>
                <li>Our services will always be provided with professionalism and at reasonable rates.</li>
                <li>The contractors we use are vetted, reliable and tried &amp; tested.</li>
                <li>You will receive detailed professional inspections reports.</li>
                <li>Finally, a dedicated manager at your service.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 border-t border-white/10 bg-black py-16 md:py-[100px]">
        <Container>
          <div className="mb-12 text-center text-white">
            <h2 className="text-[30px] font-medium md:text-[36px]">Choose the perfect plan</h2>
            <p className="mt-3 text-[15px] text-white/70">Please checkout all the features each of the plan offers at very affordable prices.</p>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`flex h-full flex-col px-8 py-10 ${p.dark ? "border border-white/20 bg-[#151515] text-white" : "bg-white text-body"}`}
              >
                <h3 className={`text-center text-[20px] font-semibold uppercase tracking-[3px] ${p.dark ? "text-white" : "text-ink"}`}>
                  {p.name}
                </h3>
                <p className="mt-5 flex items-start justify-center gap-1">
                  <span className="mt-2 text-[16px] font-medium">AED</span>
                  <span className={`text-[52px] font-semibold leading-none ${p.dark ? "text-white" : "text-ink"}`}>{p.price}</span>
                </p>
                <p className={`mt-2 text-center text-[14px] ${p.dark ? "text-white/70" : "text-muted"}`}>Per year</p>
                <hr className={`my-7 ${p.dark ? "border-white/20" : "border-line"}`} />
                <CheckList items={p.features} dark={p.dark} className="flex-1" />
                <a
                  href="#contact"
                  className={`mt-9 inline-flex justify-center px-8 py-3 text-[14px] font-medium transition-colors ${
                    p.dark ? "border border-white text-white hover:bg-white hover:text-ink" : "bg-black text-white hover:bg-accent"
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* One time services */}
      <section className="bg-black py-12">
        <h2 className="text-center text-[30px] font-medium text-white md:text-[36px]">One Time Services</h2>
      </section>
      <section className="py-[70px] md:py-[90px]">
        <Container>
          <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {oneTime.map((s) => (
              <li key={s.title} className="flex items-center gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <svg {...ic}>{icons[s.icon]}</svg>
                </span>
                <h3 className="text-[17px] font-medium text-ink">{s.title}</h3>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQ + contact */}
      <section className="bg-black py-16 md:py-[100px]">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="text-[30px] font-medium text-white md:text-[36px]">FAQ</h2>
            <p className="mb-8 mt-2 text-[15px] text-white/70">Most frequent questions and answers</p>
            <Accordion items={faqs} dark />
          </div>
          <div id="contact" className="scroll-mt-20">
            <h2 className="text-[30px] font-medium capitalize text-white md:text-[36px]">Get in touch</h2>
            <p className="mb-8 mt-2 text-[15px] text-white/70">Get a call back from our team</p>
            <LeadForm form="Property Management" fields={fields} dark />
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-[100px]">
        <Container>
          <h2 className="mb-10 text-center font-heading text-[30px] text-ink md:text-[34px]">Our clients say</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <QuoteCard
              quote="My property had been managed by prestige for 2 years now. Service and communication is always amazing"
              name="Hilary Leigh"
              role="Landlord"
            />
            <QuoteCard
              quote="Prestige property management had helped me alot as an owner who doesn’t live in Dubai. They manage your property like it’s their own. Would highly recommend"
              name="Quintin Angus"
              role="Landlord"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
