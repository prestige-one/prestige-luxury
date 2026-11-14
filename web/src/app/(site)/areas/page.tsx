// /areas/ — Elementor page 1727209 (same content blocks as the original "About" layout).
import type { Metadata } from "next";
import Media from "@/components/Media";
import { Button, Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

const page = getPage("/areas/")!;
export const metadata: Metadata = seoMetadata(page);

const stroke = { strokeWidth: 4.36364, stroke: "#1F1F1F" } as const;
const icons = {
  shield: (
    <path d="M39.2727 57.2706C60 57.2706 106.636 26.1797 106.636 26.1797C106.636 26.1797 153.273 57.2706 174 57.2706V103.907C174 171.271 106.636 191.998 106.636 191.998C106.636 191.998 39.2727 171.271 39.2727 103.907V57.2706Z" strokeLinejoin="round" {...stroke} />
  ),
  chart: (
    <>
      <path d="M26.1819 26.1836V183.275H181.091" strokeLinecap="round" strokeLinejoin="bevel" {...stroke} />
      <path d="M63.2727 126.547L98.1818 93.82L130.909 111.275L170.182 74.1836" strokeLinecap="round" strokeLinejoin="bevel" {...stroke} />
    </>
  ),
  commercial: (
    <>
      <path d="M176.727 124.359L34.909 126.541C26.1818 135.268 19.6363 157.087 34.909 176.723H178.909C158.545 170.178 134.836 150.541 176.727 124.359Z" strokeLinejoin="round" {...stroke} />
      <path
        d="M120 48.0013L128.727 34.9062H170.182L181.091 48.0013V54.5426M120 48.0013V80.7244L126.546 89.4517H174.546L181.091 80.7244V54.5426M120 48.0013C116.374 44.8928 112.657 43.2452 109.091 42.5792C100.642 41.0013 93.0345 44.9328 89.4546 48.0013M181.091 54.5426H194.182M89.4546 48.0013V80.7244L80.7273 89.4517H39.2728L30.5455 80.7244V54.5426M89.4546 48.0013L80.7273 34.9062H39.2728L30.5455 48.0013V54.5426M30.5455 54.5426H13.0909"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        {...stroke}
      />
    </>
  ),
  management: (
    <>
      <path
        d="M149.455 162.545L106.909 189.818L62.1819 162.545L17.4546 135.272L61.091 106.181M61.091 106.181L69.8182 100.363M61.091 106.181L106.174 134.938M149.455 162.545L192 135.272L152 106.181M149.455 162.545L106.174 134.938M106.174 134.938L152 106.181M106.174 134.938L62.1819 162.545M144 100.363L152 106.181"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        {...stroke}
      />
      <path d="M102.546 109.09V67.635M102.546 67.635V17.4531L150.546 41.4531L102.546 67.635Z" strokeLinecap="round" strokeLinejoin="bevel" {...stroke} />
    </>
  ),
};

const services: { title: string; text: string; icon: keyof typeof icons }[] = [
  {
    title: "Residential Property Sales",
    text: "Explore luxury properties for sale in Dubai, including premium apartments, exclusive villas, townhouses and waterfront residences, with expert guidance throughout the buying process.",
    icon: "shield",
  },
  {
    title: "Residential Leasing",
    text: "Discover properties for rent in Dubai with personalised support for property searches, viewings, lease negotiations and tenancy arrangements.",
    icon: "chart",
  },
  {
    title: "Commercial Property Sales & Leasing",
    text: "Find commercial properties in Dubai, including offices, retail spaces and investment opportunities suited to your business and financial objectives.",
    icon: "commercial",
  },
  {
    title: "Property Management Services",
    text: "Our property management services in Dubai support landlords and investors with tenant coordination, leasing administration and ongoing property oversight.",
    icon: "management",
  },
  {
    title: "Property Valuation & Advisory",
    text: "Make confident property decisions with professional property valuation in Dubai, supported by market insights, comparative analysis and expert advice.",
    icon: "shield",
  },
  {
    title: "Real Estate Investment Advisory",
    text: "Explore Dubai property investment opportunities with personalised guidance on market trends, emerging locations and long-term investment potential.",
    icon: "chart",
  },
];

export default function AreasPage() {
  return (
    <>
      {/* About us */}
      <section className="bg-[#fcfcfc] py-[50px] md:py-[100px]">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr_1fr] lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="text-[15px] font-light uppercase text-ink">About Us</p>
            <h1 className="mt-2 text-[35px] font-medium leading-tight text-ink md:text-[2.8rem]">Prestige Luxury Real Estate</h1>
            <div className="mx-auto mt-5 h-[2px] w-[15%] bg-ink lg:mx-0" />
          </div>
          <div className="space-y-4 text-[14px] font-light leading-[2]">
            <p>
              Established in 2007, <b className="font-semibold">Prestige Luxury Real Estate</b> is a leading luxury real estate agency in Dubai, specialising in
              residential and commercial property sales, leasing, property management and real estate investment advisory.
            </p>
            <p>
              With over 100 dedicated real estate professionals, we combine extensive local market knowledge, established industry relationships and personalised
              service to connect buyers, sellers and investors with exceptional properties across Dubai.
            </p>
            <p>
              From luxury apartments and waterfront residences to exclusive villas and commercial properties, our portfolio spans some of Dubai’s most
              sought-after communities.
            </p>
            <p>
              Our expertise extends across every stage of the property journey, from identifying the right investment opportunity and arranging property
              viewings to expert negotiations and ownership transfers.
            </p>
            <p>
              At Prestige Luxury, we believe every property decision deserves the right expertise. Our commitment to integrity, transparency and lasting client
              relationships has shaped our reputation as a trusted real estate company in Dubai.
            </p>
          </div>
          <div className="hidden md:block">
            <Media
              src="/wp-content/uploads/elementor/thumbs/12356844_499481870212421_8140513907742737406_o-7pkuhn1f49ey4j4ja02ar0ifi6t4xzgyfrid2kaz1n4.jpg"
              alt="Prestige Real Estate - Marina Plaza"
              width={600}
              height={800}
              sizes="(min-width: 1024px) 340px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="border border-[#ebebeb] bg-mist py-[50px]">
        <Container>
          <h2 className="text-center text-[28px] font-medium text-ink md:text-[32px]">Our Real Estate Services</h2>
          <p className="mx-auto mt-3 max-w-[570px] text-center text-[15px] text-body">
            Explore comprehensive real estate services in Dubai, tailored to your residential, commercial and investment requirements.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex flex-col items-center gap-5 rounded-[5px] border border-[#dbdbdb] bg-white px-[25px] py-[35px] text-center transition-colors duration-300 hover:bg-smoke"
              >
                <svg width="60" height="60" viewBox="0 0 210 210" fill="none" aria-hidden>
                  {icons[s.icon]}
                </svg>
                <div>
                  <h3 className="text-[17px] font-medium text-ink">{s.title}</h3>
                  <p className="mt-3 text-[14px] leading-[19px] text-[#5f5f5f]">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Commitment */}
      <section className="bg-white py-[50px]">
        <Container className="text-center">
          <h2 className="text-[28px] font-medium text-ink md:text-[32px]">The Prestige Commitment</h2>
          <h3 className="mt-2 text-[15px] font-medium text-ink">Every Property Decision Deserves the Right Expertise.</h3>
          <p className="mx-auto mt-4 max-w-[570px] text-[15px] text-body">
            Whether you’re buying a luxury home, selling an investment property or exploring Dubai’s commercial real estate market, our experienced property
            advisors are committed to making every step informed, efficient and seamless.
          </p>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-black px-5 py-20 text-center md:px-[100px] md:py-[120px]">
        <Media src="/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg" alt="" fill tone="ink" sizes="100vw" className="object-cover opacity-[0.33]" />
        <div className="relative z-10">
          <h2 className="text-[23px] font-medium text-white">Exceptional Properties. Expert Advisory. Trusted Relationships.</h2>
          <Button href="/contact-us/" variant="light" className="mt-6 rounded-[3px] border border-black">
            Speak to a Property Specialist
          </Button>
        </div>
      </section>
    </>
  );
}
