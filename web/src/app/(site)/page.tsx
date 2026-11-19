import type { Metadata } from "next";
import SalesExpertsCta from "@/components/SalesExpertsCta";
import HeroSearch from "@/components/HeroSearch";
import BackgroundVideo from "@/components/BackgroundVideo";
import { Button, Container, ImageCard, SectionTitle } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import DeveloperLogoSlider from "@/components/developers/DeveloperLogoSlider";
import CuratedProperties from "@/components/home/CuratedProperties";
import FeaturedAreas from "@/components/home/FeaturedAreas";
import WhyPrestige from "@/components/home/WhyPrestige";
import GoogleTestimonials from "@/components/home/GoogleTestimonials";
import ScrollReveal from "@/components/ScrollReveal";
import { collectionIntro } from "@/lib/page-seo";
import { communities, properties, propertyTypes } from "@/lib/properties";
import { site } from "@/lib/site";

const home = getPage("/")!;
export const metadata: Metadata = seoMetadata({ ...home, path: "/" });

const services = [
  {
    title: "Speak to a Property Expert",
    text: "Personalised guidance from experienced advisors who understand Dubai's real estate market.",
    cta: "Explore Our Expertise",
    href: "/contact-us/",
    // headset — an adviser on the line
    icon: (
      <>
        <path d="M4.5 14v-2.5a7.5 7.5 0 0 1 15 0V14" />
        <rect x="2" y="13" width="4.6" height="6.2" rx="2.3" />
        <rect x="17.4" y="13" width="4.6" height="6.2" rx="2.3" />
        <path d="M19.2 19.2v.6a2.3 2.3 0 0 1-2.3 2.3h-3.1" />
        <circle cx="12.4" cy="22.1" r="0.9" />
      </>
    ),
  },
  {
    title: "List Your Property",
    text: "Position your property for success with strategic marketing, market insights and dedicated sales expertise.",
    cta: "List With Prestige",
    href: "/sell/",
    // a listing sheet — folded corner, bulleted lines
    icon: (
      <>
        <path d="M6.5 2.5h8L19 7v14.5H6.5z" />
        <path d="M14.5 2.5V7H19" />
        <circle cx="9.4" cy="11" r="0.75" />
        <circle cx="9.4" cy="14.5" r="0.75" />
        <circle cx="9.4" cy="18" r="0.75" />
        <path d="M11.6 11h4.9M11.6 14.5h4.9M11.6 18h4.9" />
      </>
    ),
  },
  {
    title: "Explore Our Market Reports",
    text: "Stay informed with Dubai real estate market trends, property insights and investment analysis to make confident decisions.",
    cta: "View Market Reports",
    href: "/blog/",
    icon: <path d="M4 3v18h17M7 15l4-4 3 3 6-7" />,
  },
];

/** Best-photographed office listing on the books, used for the Commercial card. */
const officePhoto = properties
  .filter((p) => p.type === "Office" && p.images.length > 0)
  .sort((a, b) => b.images.length - a.images.length)[0]?.images[0];

const residential = [
  {
    title: "Apartments",
    text: "Find modern apartments that connect comfortable living with the places you love.",
    image: "/wp-content/uploads/2024/05/ADM240338_10.jpg",
    href: "/property-type/apartments/",
  },
  {
    title: "Villa",
    text: "Explore spacious villas with private outdoor areas and room for the whole family.",
    image: "/wp-content/uploads/2020/10/Villa-PrestigeRealEstate.jpg",
    href: "/property-type/villa/",
  },
  {
    title: "Commercial",
    text: "Explore commercial spaces designed to help your business thrive.",
    // the agency's own office listing photography, not a stock interior
    image: officePhoto ?? "/wp-content/uploads/2024/03/Princess-Tower-Dubai-Marina-Dubai-Marina-SAL240055-Prestige-Luxury-Real-Estate-1170x785.jpg",
    href: "/property-type/office/",
  },
];

const defaultLocations = ["Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "Business Bay", "Jumeirah Village Circle", "Dubai Hills Estate", "Jumeirah Beach Residence"];

export default function HomePage() {
  const listed = communities();
  const locations = listed.length ? listed : defaultLocations;

  return (
    <ScrollReveal>
      {/* Self-hosted background video + search */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-black py-24 md:h-screen md:min-h-[640px] md:py-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <BackgroundVideo src="/videos/dubai-city-view.mp4" poster={site.ctaImage} />
          <div className="absolute inset-0 bg-black/30" />
          {/* gentle top/bottom shading for headline + search legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
        </div>
        <div className="relative z-10 w-full px-5 pt-14 md:pt-20">
          <h1 data-pl-reveal className="mx-auto mb-10 max-w-[900px] text-center text-[30px] font-semibold leading-[1.2] tracking-[-0.02em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)] sm:text-[36px] md:mb-20 md:text-[44px]">
            Exceptional Properties. Expert Guidance.
          </h1>
          <div data-pl-reveal><HeroSearch locations={locations} types={propertyTypes} /></div>
        </div>
      </section>

      <div data-pl-reveal><DeveloperLogoSlider /></div>
      <CuratedProperties />

      <WhyPrestige />

      {/* Services */}
      <section className="bg-smoke py-16 md:py-[100px]">
        <Container>
          <div data-pl-reveal><SectionTitle
            title="Every Property Decision Deserves the Right Expertise."
            subtitle="From finding your next home to making a strategic investment, discover real estate services designed around your goals."
          /></div>
          <div data-pl-reveal-group className="grid gap-5 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex flex-col items-center rounded-[8px] border border-line bg-white px-6 pb-8 pt-10 text-center transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)]"
              >
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="0.9" aria-hidden>
                  {s.icon}
                </svg>
                <h3 className="mt-6 text-[18px] capitalize text-ink">{s.title}</h3>
                <p className="mt-2 mb-6 text-[14px] leading-[1.6] text-muted">{s.text}</p>
                <Button href={s.href} className="mt-auto">
                  {s.cta}
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Residential properties */}
      <section className="bg-white py-16 md:py-[100px]">
        <Container>
          <div data-pl-reveal><SectionTitle title="Discover Our Properties" subtitle={collectionIntro.description} /></div>
          <div data-pl-reveal-group className="grid gap-[30px] md:grid-cols-3">
            {residential.map((r) => (
              <ImageCard key={r.title} {...r} tone="smoke" radius={8} />
            ))}
          </div>
        </Container>
      </section>

      {/* Featured areas */}
      <FeaturedAreas />

      <GoogleTestimonials />

      {/* CTA */}
      <div data-pl-reveal><SalesExpertsCta image={site.ctaImage} /></div>
    </ScrollReveal>
  );
}
