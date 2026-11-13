import type { Metadata } from "next";
import Image from "next/image";
import { CtaBanner, Eyebrow } from "@/components/info/blocks";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = seoMetadata(getPage("/about/")!);

const icon = { width: 56, height: 56, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1, "aria-hidden": true } as const;

const services = [
  {
    title: "Residential Property Sales",
    text: "Explore luxury properties for sale in Dubai, including premium apartments, exclusive villas, townhouses and waterfront residences, with expert guidance throughout the buying process.",
    icon: (
      <svg {...icon}>
        <path d="M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10" />
      </svg>
    ),
  },
  {
    title: "Residential Leasing",
    text: "Discover properties for rent in Dubai with personalised support for property searches, viewings, lease negotiations and tenancy arrangements.",
    icon: (
      <svg {...icon}>
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 9-9M17 6l2 2M15 8l2 2" />
      </svg>
    ),
  },
  {
    title: "Commercial Property Sales & Leasing",
    text: "Find commercial properties in Dubai, including offices, retail spaces and investment opportunities suited to your business and financial objectives.",
    icon: (
      <svg {...icon}>
        <path d="M4 21V5l8-2v18M12 8h8v13M2 21h20M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2" />
      </svg>
    ),
  },
  {
    title: "Property Management Services",
    text: "Our property management services in Dubai support landlords and investors with tenant coordination, leasing administration and ongoing property oversight.",
    icon: (
      <svg {...icon}>
        <rect x="5" y="4" width="14" height="17" rx="1" />
        <path d="M9 4V2.5h6V4M8.5 10h7M8.5 14h7M8.5 18h4" />
      </svg>
    ),
  },
  {
    title: "Property Valuation & Advisory",
    text: "Make confident property decisions with professional property valuation in Dubai, supported by market insights, comparative analysis and expert advice.",
    icon: (
      <svg {...icon}>
        <path d="M4 3v18h17M7 15l4-4 3 3 6-7" />
      </svg>
    ),
  },
  {
    title: "Real Estate Investment Advisory",
    text: "Explore Dubai property investment opportunities with personalised guidance on market trends, emerging locations and long-term investment potential.",
    icon: (
      <svg {...icon}>
        <circle cx="12" cy="12" r="9" />
        <path d="M14.8 9.2a3 3 0 0 0-2.8-1.7c-1.6 0-2.8.9-2.8 2.2 0 3 5.8 1.6 5.8 4.6 0 1.3-1.3 2.2-3 2.2a3.2 3.2 0 0 1-3-1.8M12 6v1.5M12 16.5V18" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro: title | text | photo */}
      <section className="bg-[#fcfcfc] py-16 md:py-[100px]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:grid-cols-2 lg:grid-cols-[35%_38%_27%] lg:gap-0">
          <Eyebrow as="h1" label="About Us" title="Prestige Luxury Real Estate" className="md:col-span-2 lg:col-span-1 lg:pl-[12%] lg:pr-12" />
          <div className="space-y-5 text-[14px] font-light leading-[2] text-body lg:pr-[15%] lg:pt-[50px]">
            <p>
              Established in 2007, <b className="font-semibold">Prestige Luxury Real Estate</b> is a leading luxury real estate agency in
              Dubai, specialising in residential and commercial property sales, leasing, property management and real estate investment
              advisory.
            </p>
            <p>
              With over 100 dedicated real estate professionals, we combine extensive local market knowledge, established industry
              relationships and personalised service to connect buyers, sellers and investors with exceptional properties across Dubai.
            </p>
            <p>
              From luxury apartments and waterfront residences to exclusive villas and commercial properties, our portfolio spans some of
              Dubai’s most sought-after communities.
            </p>
            <p>
              Our expertise extends across every stage of the property journey, from identifying the right investment opportunity and
              arranging property viewings to expert negotiations and ownership transfers.
            </p>
            <p>
              At Prestige Luxury, we believe every property decision deserves the right expertise. Our commitment to integrity,
              transparency and lasting client relationships has shaped our reputation as a trusted real estate company in Dubai.
            </p>
          </div>
          <div className="relative min-h-[420px] overflow-hidden">
            <Image
              src="/wp-content/uploads/elementor/thumbs/12356844_499481870212421_8140513907742737406_o-7pkuhn1f49ey4j4ja02ar0ifi6t4xzgyfrid2kaz1n4.jpg"
              alt="Prestige Luxury Real Estate office in Dubai Marina"
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-[#ebebeb] bg-mist py-[50px] md:py-[80px]">
        <Container>
          <div className="mx-auto mb-12 max-w-[600px] text-center">
            <h2 className="font-heading text-[30px] text-ink md:text-[34px]">Our Real Estate Services</h2>
            <p className="mt-3 text-[15px] text-muted">
              Explore comprehensive real estate services in Dubai, tailored to your residential, commercial and investment requirements.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex flex-col items-center rounded-[5px] border border-[#dbdbdb] bg-white px-6 py-9 text-center transition-colors duration-300 hover:bg-smoke"
              >
                <span className="text-ink">{s.icon}</span>
                <h3 className="mt-5 text-[17px] font-medium text-ink">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-[19px] text-[#5f5f5f]">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The Prestige Commitment */}
      <section className="py-[50px] md:py-[80px]">
        <Container className="text-center">
          <h2 className="font-heading text-[30px] text-ink md:text-[34px]">The Prestige Commitment</h2>
          <p className="mt-3 text-[15px] font-medium text-ink">Every Property Decision Deserves the Right Expertise.</p>
          <p className="mx-auto mt-4 max-w-[570px] text-[15px] leading-[1.7] text-muted">
            Whether you’re buying a luxury home, selling an investment property or exploring Dubai’s commercial real estate market, our
            experienced property advisors are committed to making every step informed, efficient and seamless.
          </p>
        </Container>
      </section>

      <CtaBanner
        image="/wp-content/uploads/2026/11/city-view.webp"
        title="Exceptional Properties. Expert Advisory. Trusted Relationships."
        cta={{ label: "Speak to Sales Person", href: "/contact-us/" }}
      />
    </>
  );
}
