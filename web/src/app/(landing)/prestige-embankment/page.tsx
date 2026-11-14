import Media from "@/components/Media";
import LeadForm from "@/components/LeadForm";
import Gallery from "@/components/landing/Gallery";
import LeadModal from "@/components/landing/LeadModal";
import { BenefitRow, FormBox, LinksFooter, LpHeading, LogoBar, btn, projectFields } from "@/components/landing/shared";
import { getPage, seoMetadata } from "@/lib/content";
import { requirePublishedPage } from "@/lib/page-publication-guard";

export const metadata = seoMetadata(getPage("/prestige-embankment/")!);

const FORM = "Prestige Embankment";
const REDIRECT = "/thank-you-embankment/";
const up = (f: string) => `/wp-content/uploads/2023/04/${f}`;

const stats = [
  { label: "Price", pre: "Starting From", value: "1.34M" },
  { label: "Expected Completion", value: "Q2 2024" },
  { label: "Fully Furnished", value: "Turn Key Apartments" },
  { label: "Size", pre: "Starting From", value: "835 Sq.Ft" },
];

const gallery = [
  { f: "25.jpg", w: 1000, h: 563 },
  { f: "23.jpg", w: 1000, h: 957 },
  { f: "27.jpg", w: 1000, h: 563 },
  { f: "22.jpg", w: 1000, h: 957 },
  { f: "24.jpg", w: 1000, h: 563 },
  { f: "26.jpg", w: 1000, h: 563 },
].map((g) => ({ src: up(g.f), width: g.w, height: g.h, alt: "The Embankment by ORRA" }));

const amenities: [string, string][] = [
  ["hand-holding-water.png", "Spacious Lobby With Concierge Service"],
  ["elevator.png", "High-Speed Elevators"],
  ["check-shield.png", "Security System"],
  ["bathrobe.png", "Spa & Salon"],
  ["weights-gym.png", "Fully Equipped Gymnasium"],
  ["hot-seat.png", "Sauna / Steam Room"],
  ["Group-25.png", "Children’s Play Area"],
  ["hand-key.png", "Changing Room & Locker"],
  ["seated-pose.png", "Yoga Studio"],
  ["no-smoking.png", "Rooftop Cigar Lounge"],
  ["view-window.png", "Breathtaking Views"],
  ["sneakers-footware-shoe.png", "250-Meter Synthetic Jogging Track"],
  ["soccer-football-field.png", "Professional Multipurpose Court"],
  ["swimming-pool.png", "Infinity Deck Pool & Jacuzzi"],
  ["airline.png", "20 Mins Away From Dubai Airport"],
];

const distances = [
  { icon: "Layer_1.png", w: 81, h: 89, time: "1 Min", place: "Nearest Shopping Mall" },
  { icon: "map-point.png", w: 83, h: 98, time: "2 Min", place: "Sheikh Zayed Road" },
  { icon: "dxb-air.png", w: 97, h: 71, time: "20 Min", place: "Dubai International Airport" },
];

const about = [
  "Located in the Uptown Dubai District, The Embankment stands tall as one of the most illustrious projects. This project exudes an air of creativity, luxury and extravagance that is simply unparalleled. With impeccable attention to detail and world-class design, each residence is a true masterpiece, a unique expression of opulence and sophistication.",
  "You’ll always be at the beating heart of Dubai, where a vibrant 24-hour community awaits you. Indulge in premium retail therapy at upscale boutiques, revel in the electrifying entertainment hub, and bask in the luxury of world-renowned hotels and businesses. Immerse yourself in the pinnacle of convenience with easy access to major shopping malls, public transport links, and elite educational institutions.",
  "The exquisite design language of The Embankment’s properties seamlessly blends with the stunning interiors and exteriors, creating an unparalleled visual feast for the senses. It’s your chance to indulge in a lifestyle of pure refinement, where every morning is greeted by the breathtaking views of the prestigious Uptown Dubai District, the tranquil Jumeirah Island Community, and the iconic Ain Dubai.",
  "The wide selection of properties at includes 1 & 2 bedroom apartments, all meticulously crafted to offer you a lifestyle of unparalleled luxury. The apartments are adorned with lavish finishes and breathtaking interiors and are impeccably designed with a contemporary style. The spacious bedrooms with en-suite baths and expansive sundeck balconies elevate the concept of luxury to unmatched heights, whilst the living areas provide panoramic views of stunning vistas.",
];

export default function PrestigeEmbankmentPage() {
  requirePublishedPage("/prestige-embankment/");
  const fields = projectFields();
  const modal = (label: string, className: string, request: string) => (
    <LeadModal
      label={label}
      className={className}
      title="Learn More About The Embankment"
      form={FORM}
      fields={fields}
      extra={{ request }}
      submitLabel="Book a Free Consultation"
      redirectTo={REDIRECT}
    />
  );

  return (
    <div className="pl-project-page pl-embankment-page">
      <LogoBar />
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-20 pt-8 md:px-[100px] md:pb-[100px]">
        <Media src={up("head1.png")} alt="" fill priority tone="ink" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#000000_3%,#02071200_77%)] opacity-[0.97]" />
        <div className="relative">
          <LpHeading as="h1" className="mx-auto mt-12 max-w-[1300px] md:mt-[50px]">
            Experience a Premium Luxury Lifestyle at ORRA The Embankment
          </LpHeading>
          <dl className="pl-lp-stats mx-auto mt-9 grid max-w-[1140px] grid-cols-1 gap-5 text-center sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="border-b-[3px] border-white pb-2 text-[30px] font-light leading-tight md:text-[40px] xl:text-[48px] xl:leading-[82px]">{s.label}</dt>
                <dd className="mt-3">
                  {s.pre && <span className="block text-[20px] font-light md:text-[24px]">{s.pre}</span>}
                  <span className="block text-[30px] font-bold leading-[1.25] md:text-[40px]">{s.value}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-14 text-center">{modal("Learn More", `${btn.white} px-10 py-4 md:text-[32px]`, "Learn More")}</div>
        </div>
      </section>

      {/* Benefits + gallery */}
      <section id="benefits" className="scroll-mt-4 px-5 md:px-[100px]">
        <LpHeading className="mx-auto max-w-[1300px] pt-12 md:pt-[50px]">Relish in the Comfort of Dubai, Where Luxury Is Constantly Redefined</LpHeading>
        <BenefitRow big className="mt-14" />
        <Gallery images={gallery} layout="grid" rounded aspect="aspect-[16/10]" className="mx-auto mt-14 max-w-[1500px] md:m-5 md:mt-16 2xl:mx-auto" />
      </section>

      {/* Apartments */}
      <section id="properties" className="scroll-mt-4 px-5 pb-16 md:px-[100px] md:pb-[100px]">
        <LpHeading className="mx-auto max-w-[1300px] pt-12 md:pt-[50px]">Choose a Property That Suits Your Lifestyle at The Embankment</LpHeading>
        <div className="mx-auto mt-14 grid max-w-[1500px] gap-14 md:grid-cols-2 md:gap-10">
          {[
            { title: "1 Bedroom Apartment", img: "11.jpg" },
            { title: "2 Bedroom Apartment", img: "12.jpg" },
          ].map((a) => (
            <div key={a.title} className="text-center">
              <h3 className="text-[30px] font-extrabold leading-tight md:text-[48px] md:leading-[60px]">{a.title}</h3>
              <Media src={up(a.img)} alt={`The Embankment ${a.title}`} width={916} height={549} sizes="(min-width: 768px) 50vw, 100vw" className="mt-6 h-auto w-full" />
              {modal("Take a 3D Tour", "pl-lp-tour mt-4 px-4 py-3 text-[24px] text-white underline-offset-8 hover:underline md:text-[32px]", `3D Tour – ${a.title}`)}
            </div>
          ))}
        </div>
      </section>

      {/* Amenities (white) */}
      <section id="lifestyle" className="scroll-mt-4 bg-white px-5 pb-20 text-black md:px-[100px] md:pb-[100px]">
        <LpHeading dark className="mx-auto max-w-[1300px] pt-12 md:pt-[50px]">
          Enjoy Unparalleled Amenities & Features
        </LpHeading>
        <ul className="mx-auto mt-14 grid max-w-[1300px] grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {amenities.map(([icon, label]) => (
            <li key={label} className="flex flex-col items-center text-center">
              <span className="flex h-[92px] w-[92px] items-center justify-center rounded-[50px] border border-black p-[10px]">
                <Media src={up(icon)} alt="" width={71} height={71} className="h-[60px] w-[60px] object-contain" />
              </span>
              <span className="mt-3 text-[16px] leading-[1.6] md:text-[20px] md:leading-[33px]">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* About */}
      <section className="px-5 pb-20 md:px-[100px] md:pb-[100px]">
        <LpHeading className="pt-12 md:pt-[50px]">About The Embankment</LpHeading>
        <div className="mx-auto mt-14 grid max-w-[1500px] items-start gap-12 lg:grid-cols-2">
          <div className="pl-lp-copy text-left text-[16px] leading-[1.85]">
            {about.map((p) => (
              <p key={p.slice(0, 20)} className="mb-[1em]">
                {p}
              </p>
            ))}
            <div className="mt-10">{modal("Book a Free Consultation", `${btn.black} px-8 py-3 md:text-[32px]`, "Book a Free Consultation")}</div>
          </div>
          <Media src={up("21.jpg")} alt="The Embankment by ORRA" width={545} height={932} sizes="(min-width: 1024px) 50vw, 100vw" className="mx-auto h-auto w-full max-w-[545px]" />
        </div>
      </section>

      {/* Location (white) */}
      <section id="location" className="scroll-mt-4 bg-white px-5 pb-20 text-black md:px-[100px] md:pb-[100px]">
        <LpHeading dark className="pt-12 md:pt-[50px]">
          The Embankment Location
        </LpHeading>
        <Media src={up("Rectangle-145.png")} alt="Map of The Embankment location" width={1916} height={746} sizes="100vw" className="mt-12 h-auto w-full" />
        <ul className="mx-auto mt-14 grid max-w-[1300px] gap-10 sm:grid-cols-3">
          {distances.map((d) => (
            <li key={d.place} className="flex flex-col items-center text-center">
              <Media src={up(d.icon)} alt="" width={d.w} height={d.h} className="h-[90px] w-auto" />
              <span className="mt-4 text-[30px] font-bold leading-[40px] md:text-[36px]">{d.time}</span>
              <span className="text-[20px] leading-[40px] md:text-[24px]">{d.place}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Enquiry */}
      <section id="contact" className="scroll-mt-4 px-5 pb-20 pt-20 md:px-[100px] md:pt-[100px]">
        <FormBox title="Learn More About The Embankment" className="max-w-[640px]">
          <LeadForm form={FORM} fields={fields} submitLabel="Book a Free Consultation" redirectTo={REDIRECT} dark />
        </FormBox>
      </section>

      <LinksFooter
        links={[
          { key: "projects", label: "Projects", href: "#properties" },
          { key: "benefits", label: "Benefits", href: "#benefits" },
          { key: "map", label: "Map", href: "#location" },
          { key: "lifestyle", label: "Lifestyle", href: "#lifestyle" },
          { key: "testimonials", label: "Testimonials" },
        ]}
      />
    </div>
  );
}
