import type { Metadata } from "next";
import Link from "next/link";
import Media from "@/components/Media";
import HeroSearch from "@/components/HeroSearch";
import { Button, Container, ImageCard, SectionTitle } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { featuredDevelopers } from "@/lib/developers";
import { developerLogo } from "@/lib/developer-logos";
import { communities, properties, propertyTypes } from "@/lib/properties";
import { communityPhoto } from "@/lib/imagery";
import { site } from "@/lib/site";

const home = getPage("/")!;
export const metadata: Metadata = { ...seoMetadata({ ...home, path: "/" }), title: { absolute: `${site.name} • ${site.tagline}` } };

/**
 * Developers we are registered with. Drawn from the registered-developer list, so the strip can
 * never advertise a developer the agency is not registered with — which is what the previous
 * hard-coded logo row did. Each one shows its own logo where we hold the file (see
 * `lib/developer-logos.ts`) and its name where we do not, so the row is never half-empty.
 */
const marqueeDevelopers = featuredDevelopers().map((d) => ({ ...d, logo: developerLogo(d.slug) }));

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
    href: "/property-type/apartment/",
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

/**
 * The four investment destinations the owner asked for (2026-11-14), with their copy.
 *
 * Photography is the agency's own throughout: Dubai Islands and DLRC take the best shot from a
 * live listing in that community, and the other two use library photographs of the district
 * itself. Meydan Horizon and Dubai Maritime City have no listings on the books yet, so there is
 * no `/area/` page to send people to — both point at New Developments until there is one.
 */
const areas = [
  {
    title: "Dubai Islands",
    text: "An emerging waterfront investment destination offering luxury beachfront properties, strong capital appreciation potential and long-term growth opportunities.",
    image: communityPhoto("Dubai Islands", { size: "full" }) ?? "/wp-content/uploads/2020/02/waterfront-properties-dubai.jpg",
    href: "/area/dubai-islands/",
  },
  {
    title: "Meydan Horizon",
    text: "A prestigious residential destination attracting investors with luxury developments, rental demand and long-term property value appreciation.",
    image: "/wp-content/uploads/2019/05/mbr-city-dubai.jpg",
    href: "/status/off-plan/",
  },
  {
    title: "Dubai Maritime City",
    text: "A growing waterfront location offering premium residences, limited waterfront supply and potential for rental returns and capital appreciation.",
    image: "/wp-content/uploads/2020/02/waterfront-properties-dubai.jpg",
    href: "/status/off-plan/",
  },
  {
    title: "Dubai Land Residence Complex (DLRC)",
    text: "An emerging investment hotspot offering competitively priced apartments, attractive rental yield potential and opportunities for capital growth.",
    image: communityPhoto("Dubai Land Residence Complex", { size: "full" }) ?? "/wp-content/uploads/2019/05/jumeirah-village-circle.jpg",
    href: "/area/dubai-land-residence-complex/",
  },
];

const defaultLocations = ["Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "Business Bay", "Jumeirah Village Circle", "Dubai Hills Estate", "Jumeirah Beach Residence"];

export default function HomePage() {
  const listed = communities();
  const locations = listed.length ? listed : defaultLocations;

  return (
    <>
      {/* Hero: full-screen YouTube background video + search */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-black py-24 md:h-screen md:min-h-[640px] md:py-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <iframe
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            src={`https://www.youtube-nocookie.com/embed/${site.heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${site.heroVideoId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1`}
            title="Dubai city view at night"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
          <div className="absolute inset-0 bg-black/30" />
          {/* gentle top/bottom shading for headline + search legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
        </div>
        <div className="relative z-10 w-full px-5 pt-14 md:pt-20">
          <h1 className="mx-auto mb-10 max-w-[900px] text-center text-[28px] font-semibold capitalize leading-[1.25] tracking-[-0.01em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)] sm:text-[32px] md:mb-[150px] md:text-[36px]">
            Discover Your Dream Home in Dubai
          </h1>
          <HeroSearch locations={locations} types={propertyTypes} />
        </div>
      </section>

      {/* Developers we are registered with */}
      <section className="overflow-hidden border-y border-line bg-cream py-7">
        <div className="flex w-max animate-marquee items-center gap-12" aria-label="Developers we are registered with" role="group">
          {[0, 1, 2, 3].flatMap((copy) =>
            marqueeDevelopers.map((d) => (
              <Link
                key={`${copy}-${d.slug}`}
                href={`/developers/${d.slug}/`}
                // the marquee repeats the row to loop seamlessly: only the first copy is announced
                aria-hidden={copy === 0 ? undefined : true}
                tabIndex={copy === 0 ? undefined : -1}
                className={
                  d.logo
                    ? "flex h-[46px] w-[150px] shrink-0 items-center justify-center opacity-65 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0 md:h-[54px] md:w-[180px]"
                    : "shrink-0 whitespace-nowrap font-heading text-[17px] font-medium uppercase tracking-[0.14em] text-ink/55 transition-colors duration-200 hover:text-ink md:text-[19px]"
                }
              >
                {d.logo ? (
                  <Media
                    src={d.logo}
                    alt={d.name}
                    width={180}
                    height={54}
                    tone="mist"
                    // served as-is: the optimiser refuses SVG without `dangerouslyAllowSVG`,
                    // and these files are already a few kB each
                    unoptimized
                    className="h-full w-full object-contain"
                  />
                ) : (
                  d.name
                )}
              </Link>
            )),
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-[100px]">
        <Container>
          <SectionTitle
            title="Every Property Decision Deserves the Right Expertise."
            subtitle="From finding your next home to making a strategic investment, discover real estate services designed around your goals."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex flex-col items-center rounded-[2px] border border-line bg-white px-6 pb-8 pt-10 text-center transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)]"
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
      <section className="pb-16 md:pb-[100px]">
        <Container>
          <SectionTitle title="Explore Properties" subtitle="Browse through our beautiful collection of residential properties" />
          <div className="grid gap-[30px] md:grid-cols-3">
            {residential.map((r) => (
              <ImageCard key={r.title} {...r} />
            ))}
          </div>
        </Container>
      </section>

      {/* Featured areas */}
      <section className="bg-mist py-16 md:py-[100px]">
        <Container>
          <SectionTitle
            title="Explore the top featured areas of Dubai"
            subtitle="These are the top world renowned areas in Dubai offering some of the highest ROI in the world."
          />
          <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a) => (
              <ImageCard key={a.title} {...a} tone="white" aspect="aspect-[253/170]" />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden py-16 text-center md:min-h-[414px]">
        {/* Downtown skyline — the MBR City shot now carries the Meydan Horizon card above */}
        <Media src="/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg" alt="" fill tone="ink" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-[600px] px-5">
          <h2 className="text-[26px] font-medium capitalize leading-[1.25] tracking-[-0.01em] text-white md:text-[30px]">Connect with our sales experts</h2>
          <p className="mt-3 text-[15px] capitalize leading-[1.6] text-white/90 md:text-[17px]">
            Connect with our property specialists to discover the right real estate opportunity in Dubai.
          </p>
          <Button href="/contact-us/" variant="light" className="mt-6">
            Speak to a Property Specialist
          </Button>
        </div>
      </section>
    </>
  );
}
