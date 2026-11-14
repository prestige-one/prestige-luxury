import type { Metadata } from "next";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import Media from "@/components/Media";
import { Accordion } from "@/components/info/blocks";
import { areaOptions, propertyTypeOptions } from "@/components/info/options";
import { Breadcrumb, Container, ImageCard, PageBanner } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { communityPhoto, featurePhoto } from "@/lib/imagery";

export const metadata: Metadata = seoMetadata(getPage("/sell/")!);

// Photographs come from the agency's own current listings, with a photo from the media
// library as the fallback for when a community has no well-photographed listing today.
const heroImage = "/images/dubai-waterfront-cta.webp";
const whyImage = featurePhoto("Why sell with Prestige Luxury", "full") ?? "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg";
const saleImage = communityPhoto("Downtown Dubai") ?? "/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg";
const rentImage = communityPhoto("Jumeirah Village Circle") ?? "/wp-content/uploads/2019/05/jumeirah-village-circle.jpg";

/** The points the copy below makes, surfaced so the section is not one unbroken wall of text. */
const highlights = [
  { figure: "100+", label: "Brokers working on your sale", text: "Our offices speak daily, so a buyer registered with one team hears about your property from all of them." },
  { figure: "3", label: "Major portals, plus our own site", text: "Property Finder, Dubizzle and Bayut, with professional photography, video tours and email and SMS alerts." },
  { figure: "1", label: "In-house sales progression team", text: "They carry the paperwork from signed contracts through the developer’s NOC to the transfer." },
];


const fields: LeadField[] = [
  { name: "user_type", label: "I'm a", type: "select", options: ["I'm a property owner", "I'm a real estate agent"], required: true },
  { name: "first_name", label: "First Name", required: true, half: true },
  { name: "last_name", label: "Last Name", half: true },
  { name: "email", label: "Email Address", type: "email", required: true, half: true },
  { name: "phone", label: "Mobile", type: "tel", required: true, half: true },
  { name: "area", label: "Select Area", type: "select", options: areaOptions, required: true, half: true },
  {
    name: "property_type",
    label: "Select type",
    type: "select",
    options: propertyTypeOptions,
    required: true,
    half: true,
  },
  { name: "asking_price", label: "Asking price", required: true, half: true },
  { name: "size_sqft", label: "Property size (Sq Ft)", required: true, half: true },
  { name: "beds", label: "Number of beds", required: true, half: true },
  { name: "baths", label: "Number of baths", required: true, half: true },
  { name: "message", label: "Message", type: "textarea" },
];

const steps = [
  {
    title: "Step 1: Property Appraisal",
    text: "Our specialized agents will assess your property based on current market conditions and compile a detailed property valuation report. This step ensures you receive an accurate and comprehensive understanding of your property’s value.",
  },
  {
    title: "Step 2: Marketing Preparation",
    text: "Upon your agreement to proceed, we will begin crafting a tailored marketing campaign for your property. Our goal is to present your property in the best possible light to attract potential leads.",
  },
  {
    title: "Step 3: Professional Photography and Listing",
    text: "Our team of professional photographers will showcase your property’s best features. Together with a compelling listing description, we aim to generate a high volume of leads by capturing the essence and appeal of your property.",
  },
  {
    title: "Step 4: On-site Advertising",
    text: "Based on the nature of your property, we will place ‘For Rent’ or ‘For Sale’ signage prominently outside your property. This traditional method complements our online efforts by attracting local potential buyers or tenants.",
  },
  {
    title: "Step 5: Online Advertising",
    text: "We will feature your property on leading property portals—fully leveraging the quality photographs and detailed descriptions to ensure it stands out from the competition. This step is crucial for wide visibility and attracting interested parties.",
  },
  {
    title: "Step 6: Digital Media Strategy",
    text: "In addition to property portals, we employ a diverse digital media strategy to promote your property. This includes advertising on platforms such as Facebook, Google, LinkedIn, and Instagram to reach a broader audience and maximize exposure.",
  },
];

const faqs = [
  {
    q: "How to sell property in Dubai if I cannot be personally for the registration process?",
    a: "<p>It is necessary for you to be in person for the process, otherwise you can come to register your property any other people with a Power of Attorney from you, where it will be described all the power in details on an owners behalf such as to cover the registration process into the seller’s name, to include the set up of the utility account and so on.</p>",
  },
  {
    q: "Could you describe the sales and purchase process?",
    a: "<p>In most instances, the transaction process goes as follows:</p><ul><li>Buyer chooses the property.</li><li>Buyer and seller sign the sales and purchase agreement, where all the terms and conditions of the deal are mentioned: the purchase price, additional expenses (agency fee, transfer fee at the DLD, developer’s fee, service charge refund, etc), the transfer date of the deal at the DLD, terms of payment and clearly-defined responsibilities and penalties for both parties in case they fail to uphold the conditions set out in the agreement.</li><li>On signing the agreement, the buyer pays the deposit. This is usually 10% of the purchase price.</li><li>The seller applies for a no-objection certificate (NOC) from the developer in order to sell the property. The NOC is required for the transfer process at the DLD.</li><li>Once the NOC is ready, the buyer and seller can transfer the property and register it on the buyer’s name. Usually, payments need to be made at the time of registration.</li></ul>",
  },
  {
    q: "Where is it necessary to conduct a deal and transfer of ownership?",
    a: "<p>All the transfers concerning a deal should be handled with the help of the designated Dubai Land Department Trustee Offices in Dubai. It is significant that all the parties pertaining to the financial transactions have to be present. Prestige Luxury Real Estate always informs their clients about all necessary documents and payments which are required on the day of the transfer.</p>",
  },
  {
    q: "What are the guarantees that I receive real and fair price for property that corresponds to the current real estate market situation?",
    a: "<p>Prestige Luxury Real Estate will offer you as a client, all the historical and factual market figures in order to support the correct price for the property. After that, a seller and an agency have to sign Form A, where a seller will accept and confirm to list the property for sale for a stipulated price.</p>",
  },
];

export default function SellPage() {
  return (
    <>
      <PageBanner
        title="Sell Your Property in Dubai"
        subtitle="A free, evidence-based valuation from brokers who work your community every day."
        image={heroImage}
      />
      <Container className="pt-6">
        <Breadcrumb items={[{ label: "List With Us" }]} />
      </Container>

      {/* Selling process + valuation form */}
      <section className="py-14 md:py-[90px]">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-8 text-[26px] font-semibold uppercase tracking-wide text-ink md:text-[30px]">Property Selling Process</h2>
            <ol className="space-y-7">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-heading text-[14px] font-semibold text-white"
                  >
                    {i + 1}
                  </span>
                  <span className="text-[14.5px] leading-[1.8] text-body">
                    {/* the number is in the badge, so drop the "Step N: " prefix from the heading */}
                    <strong className="block text-[15px] font-semibold text-ink">{s.title.replace(/^Step \d+:\s*/, "")}</strong>
                    {s.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div id="valuation" className="h-fit scroll-mt-24 border border-line bg-white p-6 shadow-[0_0_30px_rgba(0,0,0,0.06)] sm:p-10">
            <h2 className="mb-6 text-[22px] font-semibold uppercase tracking-wide text-ink">Book a Free Valuation</h2>
            <LeadForm form="Sell" fields={fields} />
          </div>
        </Container>
      </section>

      {/* Why sell with us */}
      <section className="bg-mist py-16 md:py-[100px]">
        <Container>
          <h2 className="mx-auto mb-10 max-w-[760px] text-center font-heading text-[28px] text-ink md:text-[34px]">
            Why Sell Your Property in Dubai with Prestige Luxury?
          </h2>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] lg:sticky lg:top-28">
              <Media src={whyImage} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="space-y-4 text-[14.5px] leading-[1.85] text-body">
              <p>
                Sell your property in Dubai with Prestige Luxury Real Estate, one of the highest lead-generating real estate companies in
                Dubai. We will market your property with the highest quality through our significant marketing spend to ensure more interest.
              </p>
              <p>
                No matter the reason for selling, we are here to offer expert advice. Come visit us at our office in Marina Plaza, Dubai
                Marina.
              </p>
              <p>
                They say strength is in numbers, this rings true when choosing a real estate broker to help you sell your property in Dubai.
                We have over 100 brokers potentially working on your behalf to help ensure your property is sold as quickly as possible, for
                as much as possible. Every day, our offices communicate to ensure buyers are informed about different properties in different
                offices, ensuring the maximum return for all involved.
              </p>
              <p>
                Our well-trained, expert real estate brokers are dedicated to specific areas, ensuring impeccable community knowledge.
                Therefore, our brokers are in a position to advise you on market trends in your area to ensure you market your property at
                the best price possible and target serious buyers.
              </p>
              <p>
                To find your perfect buyer, you need to give your property maximum exposure across a wide range of media. When you instruct
                us to sell your property in Dubai, you will automatically benefit from our unmatched marketing package, including exposure on
                our award-winning website, full-colour property details, listings on property websites including Property Finder, Dubizzle,
                and Bayut, video tours, professional pictures, and email and SMS alerts. We spend more on marketing than any other real estate
                company in Dubai.
              </p>
              <p>
                The Prestige Luxury Real Estate in-house sales progression team will ease you through the sale process once the contracts are
                signed, and it’s time to address all the legal processes involved with selling your property in Dubai. Their aim is to make
                the process as seamless as possible from obtaining the No Objection Certificate (NOC) from the developer through to the
                transfer. Your sales progressor will make sure all of your documents are in order before beginning the process to avoid
                delays.
              </p>
            </div>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-3">
            {highlights.map((h) => (
              <li key={h.label} className="border border-line bg-white p-7">
                <p className="font-heading text-[34px] leading-none text-accent">{h.figure}</p>
                <p className="mt-3 text-[15px] font-semibold text-ink">{h.label}</p>
                <p className="mt-2 text-[14px] leading-[1.75] text-body">{h.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Our properties */}
      <section className="py-16 md:py-[100px]">
        <Container>
          <div className="text-center">
            <h2 className="font-heading text-[28px] text-ink md:text-[34px]">Our Properties</h2>
            <h3 className="mt-5 text-[17px] font-medium text-ink">
              We cover residential and commercial properties in over 50 communities in Dubai.
            </h3>
            <p className="mx-auto mt-2 max-w-[640px] text-[15px] text-muted">
              Whether you are renting a property or looking to buy, we have an array of homes for you to choose from.
            </p>
          </div>
          <div className="mt-10 grid gap-7 sm:grid-cols-2">
            <ImageCard
              href="/status/for-sale/"
              image={saleImage}
              title="Properties for Sale"
              text="Apartments, villas and townhouses for sale across Dubai’s established and emerging communities."
              aspect="aspect-[16/10]"
            />
            <ImageCard
              href="/status/for-rent/"
              image={rentImage}
              title="Properties for Rent"
              text="Residential and commercial leasing, from studios to family villas, managed end to end."
              aspect="aspect-[16/10]"
            />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="pb-16 md:pb-[100px]">
        <Container className="max-w-[960px]">
          <h2 className="mb-8 text-[24px] font-medium text-ink">Questions about selling</h2>
          <Accordion items={faqs} />
        </Container>
      </section>
    </>
  );
}
