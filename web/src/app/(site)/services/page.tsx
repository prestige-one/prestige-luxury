import type { Metadata } from "next";
import Media from "@/components/Media";
import { Button, Container, PageBanner } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { isPagePublished } from "@/lib/site";

export const metadata: Metadata = seoMetadata(getPage("/services/")!);

const thumbs = "/wp-content/uploads/elementor/thumbs";

const services = [
  {
    id: "residential-sales",
    title: "Residential Sales",
    text: "Buying in Dubai is made easier when you trust our expertise to help you find your new home. We provide our clients with the latest info on the best rental homes, apartments, villas and modern townhouses for lease in prestigious locations.",
    image: `${thumbs}/DSC_6821-HDR-rra8yos467v7l49f4siec7v217jojgv90pazckhe3k.jpg`,
    href: "/search-results/?status=for-sale",
  },
  {
    id: "residential-leasing",
    title: "Residential Leasing",
    text: "Renting in Dubai is made easier when you trust our expertise to help you find your new home. We provide our clients with the latest info on the best rental homes, apartments, villas and modern townhouses for lease in prestigious locations.",
    image: `${thumbs}/DSC_6050-Small-scaled-rra8yos467v7l49f4siec7v217jojgv90pazckhe3k.jpg`,
    href: "/search-results/?status=for-rent",
  },
  {
    id: "commercial-sales",
    title: "Commercial Sales",
    text: "Dubai is a trading hub. Whether you are interested in a retail or office space let us show you the way. Our agents can advise you on areas available to you depending on your requirements, type of business, nationality and business license status.",
    image: `${thumbs}/dxblv-exterior-0043-hor-feat-rra8yos467v7l49f4siec7v217jojgv90pazckhe3k.jpg`,
    href: "/property-type/other-commercial/",
  },
  {
    id: "commercial-leasing",
    title: "Commercial Leasing",
    text: "We are dedicated on helping clients rent office space, be it warehouses, offices, Retail, labor camps or plots, backed by our know-how ensure that we put your business first. Operating in Dubai is a dream of most companies. Let us make yours a reality.",
    image: `${thumbs}/DSC_0979-1-rra8yos467v7l49f4siec7v217jojgv90pazckhe3k.jpg`,
    href: "/property-type/other-commercial/",
  },
  {
    id: "property-management",
    title: "Property Management",
    text: "Whether you are a local or overseas Landlord, entrust your property to us and we will look after it as if it was our own. We will keep your property in great condition with 24/7 property management support.",
    image: `${thumbs}/DSC_0340-rra8yos467v7l49f4siec7v217jojgv90pazckhe3k.jpg`,
    href: "/services/property-management/",
  },
  {
    id: "market-appraisals",
    title: "Market Appraisals",
    text: "We will guide you with correct marketing and pricing of property. We understand the urgency of your needs, and our in-depth understanding of the market trends translates to speedy deals and value for your assets.",
    image: `${thumbs}/photo-1503839769273-3a57baad6072-rra8yos467v7l49f4siec7v217jojgv90pazckhe3k.jpeg`,
    href: "/services/market-appraisal/",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageBanner title="Services" image="/wp-content/uploads/2020/02/bg-bw.jpg" />

      <section className="py-16 md:py-[80px]">
        <Container className="max-w-[900px] space-y-4 text-center text-[15px] leading-[1.8] text-body">
          <p>
            Prestige Real Estate offers a wide range of fully integrated real estate services with Residential &amp; Commercial Sales and
            Leasing at the forefront of the company’s services.
          </p>
          <p>
            Effective marketing tools &amp; strategies established through extensive research of the real estate market, customized
            market sectors, end-user requirements and current market conditions are provided to the Landlords and Sellers.
          </p>
          <p>
            Buyers &amp; Tenants are provided with the expertise of property specialists who have in-depth knowledge and vast experience in
            the areas they specialize in.
          </p>
        </Container>
      </section>

      <div className="space-y-10 pb-16 md:space-y-0 md:pb-[100px]">
        {services.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <Container className="grid md:grid-cols-2">
              <div className={`relative min-h-[300px] md:min-h-[420px] ${i % 2 ? "md:order-2" : ""}`}>
                <Media src={s.image} alt={s.title} fill sizes="(min-width: 768px) 570px, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center bg-black px-8 py-12 text-white md:px-14">
                <h2 className="font-medium text-section">{s.title}</h2>
                <p className="mt-5 text-[14.5px] leading-[1.8] text-white/85">{s.text}</p>
                <div className="mt-8">
                  <Button href={isPagePublished(s.href) ? s.href : "/contact-us/"} variant="light">
                    {isPagePublished(s.href) ? "Show more" : "Enquire"}
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        ))}
      </div>
    </>
  );
}
