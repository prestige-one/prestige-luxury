// Template of the single-project landing pages built on the same Elementor design:
// /orra-embankment/, /vista-by-prestige-one/, /the-residence-by-prestige-one/
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import Gallery, { type GalleryImage } from "./Gallery";
import LeadModal from "./LeadModal";
import { FormBox, LogoBar, SimpleFooter, btn, projectFields } from "./shared";

type Img = { src: string; width: number; height: number };
export type Amenity = { icon: string; label: string };

export type OffPlanConfig = {
  /** Project name, used as the form name in the lead email */
  form: string;
  redirectTo: string;
  title: string; // "EMBANKMENT"
  developer: string; // "By ORRA"
  heroImage: string;
  stats: { label: string; value: string; unit: string }[];
  heroLogo?: Img;
  intro: { title: string; subtitle: string; text: string };
  amenitiesTop: Amenity[];
  galleryTop: GalleryImage[];
  amenities: Amenity[];
  galleryBottom: GalleryImage[];
  /** true: full-width media carousel (Vista, The Residence); false: single slide with side padding (Orra) */
  galleryBottomWide?: boolean;
  location: { title: string; subtitle: string; text: string };
  contactTitle: string;
};

export default function OffPlanProject({ c }: { c: OffPlanConfig }) {
  const fields = projectFields();
  const brochure = (
    <LeadModal
      label="Request Brochure & Floorplans"
      className={btn.pill}
      title="Request Brochure & Floorplans"
      form={c.form}
      fields={fields}
      extra={{ request: "Brochure & Floorplans" }}
      submitLabel="Submit"
      redirectTo={c.redirectTo}
    />
  );

  return (
    <>
      <LogoBar />

      {/* Hero */}
      <section className="relative flex min-h-[640px] flex-col justify-end overflow-hidden bg-black lg:min-h-screen">
        <Image src={c.heroImage} alt={`${c.title} ${c.developer}`} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(190deg,#FFFFFF00_63%,#3E3E3E_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative px-5 pb-12 pt-40 text-center md:px-[8%] lg:px-[100px] lg:pb-16">
          <h1 className="text-[30px] font-bold uppercase leading-none tracking-[3.7px] md:text-[60px] xl:text-[100px]">{c.title}</h1>
          <p className="font-raleway mt-3 text-[15px] uppercase tracking-[6.2px] md:text-[30px] xl:text-[50px]">{c.developer}</p>
          <dl className={`mx-auto mt-10 grid max-w-[1400px] gap-5 bg-black/30 sm:grid-cols-2 ${c.stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {c.stats.map((s, i) => (
              <div key={i} className="border-y-[3px] border-[#A2A2A28C] px-3 py-4">
                <dt className="text-[24px] font-bold uppercase tracking-[3px] md:text-[30px] xl:text-[40px]">{s.label}</dt>
                <dd className="mt-1 text-[24px] tracking-[5px] md:text-[30px] xl:text-[45px]">
                  {s.value} <span className="font-extralight">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          {c.heroLogo && (
            <Image
              src={c.heroLogo.src}
              alt=""
              width={c.heroLogo.width}
              height={c.heroLogo.height}
              className="mx-auto mt-10 h-auto w-full max-w-[600px]"
            />
          )}
        </div>
      </section>

      <TextBlock title={c.intro.title} subtitle={c.intro.subtitle} text={c.intro.text} action={brochure} />

      <section className="px-5 pb-12 md:pb-[100px] lg:px-[100px]" aria-label="Key features">
        <AmenityGrid items={c.amenitiesTop} />
      </section>

      <PatternSection className="py-12 md:p-[50px] lg:px-[100px]">
        <Gallery images={c.galleryTop} perView={2} />
      </PatternSection>

      <section className="px-5 py-12 lg:px-[100px]" aria-label="Amenities">
        <AmenityGrid items={c.amenities} />
        <div className="mt-12 text-center">{brochure}</div>
      </section>

      <PatternSection className={c.galleryBottomWide ? "" : "py-12 md:p-[50px] lg:px-[100px]"}>
        <Gallery images={c.galleryBottom} perView={c.galleryBottomWide ? 2 : 1} />
      </PatternSection>

      <TextBlock title={c.location.title} subtitle={c.location.subtitle} text={c.location.text} action={brochure} />

      {/* Enquiry */}
      <section id="contact" className="scroll-mt-4 px-5 pb-20 pt-12 lg:px-[100px] lg:pb-[100px]">
        <h2 className="mx-auto max-w-[1200px] text-center text-[28px] uppercase leading-[1.4] tracking-[3.7px] md:text-[44px] xl:text-[50px]">
          {c.contactTitle}
        </h2>
        <FormBox title="Get in Touch" className="mt-12 lg:mt-[100px]">
          <LeadForm form={c.form} fields={fields} submitLabel="Book a Free Consultation" redirectTo={c.redirectTo} dark />
        </FormBox>
      </section>

      <SimpleFooter />
    </>
  );
}

/** Big two-line title (Mulish + Raleway) with text and a button; white rule above the left half */
function TextBlock({ title, subtitle, text, action }: { title: string; subtitle: string; text: string; action: React.ReactNode }) {
  return (
    <section className="px-5 pb-12 lg:px-[100px] lg:pb-16">
      <div className="h-[50px] w-1/2 border-b-[3px] border-white" aria-hidden />
      <div className="mx-auto max-w-[1400px] pt-10 md:pt-16">
        <h2 className="text-[25px] uppercase leading-[1.1] tracking-[3.7px] md:text-[60px] xl:text-[80px]">
          {title}
          <span className="font-raleway mt-2 block text-[20px] md:text-[55px] xl:text-[75px]">{subtitle}</span>
        </h2>
        <p className="font-raleway mt-8 text-[17px] font-light leading-[1.8] tracking-[1px] md:mt-[50px] md:text-[22px] md:leading-[42px] md:tracking-[2px]">
          {text}
        </p>
        <div className="mt-10 md:mt-[50px]">{action}</div>
      </div>
    </section>
  );
}

function AmenityGrid({ items }: { items: Amenity[] }) {
  return (
    <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4 lg:gap-x-[30px]">
      {items.map((a) => (
        <li key={a.label} className="flex flex-col items-center border-b-[3px] border-[#4E4E4E] px-2 pb-5 pt-2.5 text-center">
          <Image src={a.icon} alt="" width={98} height={98} className="h-[70px] w-[70px] md:h-[98px] md:w-[98px]" />
          <span className="mt-4 text-[14px] uppercase leading-[1.55] tracking-[2px] md:text-[16px] lg:text-[20px] lg:tracking-[2.7px]">{a.label}</span>
        </li>
      ))}
    </ul>
  );
}

function PatternSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative bg-black ${className}`} aria-label="Gallery">
      <div className="absolute inset-0 bg-[url('/wp-content/uploads/2023/05/home-1-background-patern-3.png')]" aria-hidden />
      <div className="relative">{children}</div>
    </section>
  );
}
