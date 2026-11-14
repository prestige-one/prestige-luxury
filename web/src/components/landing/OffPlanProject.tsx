// Template of the single-project landing pages built on the same Elementor design:
// /orra-embankment/, /vista-by-prestige-one/, /the-residence-by-prestige-one/
import Media from "@/components/Media";
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
    <div className="pl-project-page">
      <LogoBar />

      {/* Hero */}
      <section className="pl-lp-hero relative flex min-h-[560px] flex-col justify-end overflow-hidden bg-black lg:min-h-[640px]">
        <Media src={c.heroImage} alt={`${c.title} ${c.developer}`} fill priority tone="ink" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(190deg,#FFFFFF00_63%,#3E3E3E_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="pl-lp-shell relative px-5 pb-10 pt-32 text-center lg:pb-12">
          <h1 className="text-[30px] font-bold uppercase leading-none tracking-[3.7px] md:text-[60px] xl:text-[100px]">{c.title}</h1>
          <p className="pl-lp-developer font-raleway mt-3 text-[15px] uppercase tracking-[6.2px] md:text-[30px] xl:text-[50px]">{c.developer}</p>
          <dl className={`pl-lp-stats mx-auto mt-8 grid max-w-[1100px] gap-4 bg-black/40 sm:grid-cols-2 ${c.stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {c.stats.map((s, i) => (
              <div key={i} className="border-y border-white/25 px-3 py-4">
                <dt className="text-[24px] font-bold uppercase tracking-[3px] md:text-[30px] xl:text-[40px]">{s.label}</dt>
                <dd className="mt-1 text-[24px] tracking-[5px] md:text-[30px] xl:text-[45px]">
                  {s.value} <span className="font-extralight">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          {c.heroLogo && (
            <Media
              src={c.heroLogo.src}
              alt=""
              tone="ink"
              width={c.heroLogo.width}
              height={c.heroLogo.height}
              className="mx-auto mt-7 h-auto w-full max-w-[280px]"
            />
          )}
        </div>
      </section>

      <TextBlock title={c.intro.title} subtitle={c.intro.subtitle} text={c.intro.text} action={brochure} />

      <section className="pl-lp-shell px-5 pb-12 md:pb-16" aria-label="Key features">
        <AmenityGrid items={c.amenitiesTop} />
      </section>

      <PatternSection className="pl-lp-shell px-5 py-10 md:py-12">
        <Gallery images={c.galleryTop} perView={2} />
      </PatternSection>

      <section className="pl-lp-shell px-5 py-12 md:py-16" aria-label="Amenities">
        <AmenityGrid items={c.amenities} />
        <div className="mt-12 text-center">{brochure}</div>
      </section>

      <PatternSection className="pl-lp-shell px-5 py-10 md:py-12">
        <Gallery images={c.galleryBottom} perView={c.galleryBottomWide ? 2 : 1} />
      </PatternSection>

      <TextBlock title={c.location.title} subtitle={c.location.subtitle} text={c.location.text} action={brochure} />

      {/* Enquiry */}
      <section id="contact" className="pl-lp-shell scroll-mt-4 px-5 pb-16 pt-12 md:pb-20">
        <h2 className="mx-auto max-w-[1200px] text-center uppercase leading-[1.4] tracking-[3.7px] text-section">
          {c.contactTitle}
        </h2>
        <FormBox title="Get in Touch" className="mt-8">
          <LeadForm form={c.form} fields={fields} submitLabel="Book a Free Consultation" redirectTo={c.redirectTo} dark />
        </FormBox>
      </section>

      <SimpleFooter />
    </div>
  );
}

/** Big two-line title (Mulish + Raleway) with text and a button; white rule above the left half */
function TextBlock({ title, subtitle, text, action }: { title: string; subtitle: string; text: string; action: React.ReactNode }) {
  return (
    <section className="pl-lp-text-block pl-lp-shell px-5 py-12 md:py-16">
      <div className="h-px w-16 bg-white/40" aria-hidden />
      <div className="mt-7 grid gap-x-12 gap-y-5 md:grid-cols-[0.8fr_1.2fr]">
        <h2 className="uppercase leading-[1.1] tracking-[3.7px] text-section">
          {title}
          <span className="font-raleway mt-2 block text-[20px] md:text-[55px] xl:text-[75px]">{subtitle}</span>
        </h2>
        <p className="font-raleway text-[16px] leading-[1.85] text-white/80">
          {text}
        </p>
        <div className="md:col-start-2">{action}</div>
      </div>
    </section>
  );
}

function AmenityGrid({ items }: { items: Amenity[] }) {
  return (
    <ul className="pl-lp-amenities mx-auto grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((a) => (
        <li key={a.label} className="flex flex-col items-center border-b-[3px] border-[#4E4E4E] px-2 pb-5 pt-2.5 text-center">
          <Media src={a.icon} alt="" width={98} height={98} className="h-[70px] w-[70px] md:h-[98px] md:w-[98px]" />
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
