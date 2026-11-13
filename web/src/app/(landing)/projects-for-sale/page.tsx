import Media from "@/components/Media";
import LeadForm from "@/components/LeadForm";
import Gallery from "@/components/landing/Gallery";
import {
  AssociateSection,
  MediaFrame,
  PhotoBand,
  ProjectBlock,
  ShowcaseHero,
  featureIcons as fi,
  type ProjectFeature,
} from "@/components/landing/ProjectsShowcase";
import { BenefitRow, LinksFooter, LpHeading, Reviews, btn, contactFields } from "@/components/landing/shared";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata = seoMetadata(getPage("/projects-for-sale/")!);

const FORM = "Projects for Sale";
const REDIRECT = "/thank-you-projects/";

const thumbs = (alt: string, ...files: [string, number, number][]) =>
  files.map(([f, width, height]) => ({ src: `/wp-content/uploads/2023/10/${f}`, width, height, alt }));
const dev = (f: string, width: number, height: number, alt: string) => ({ src: `/wp-content/uploads/2023/10/${f}`, width, height, alt });

const visa: ProjectFeature = { icon: fi.visa, text: "Golden Visa" };
const tax: ProjectFeature = {
  icon: fi.tax,
  text: (
    <>
      0% Taxes on Your Property or Rental Income
      <br />
      Residence Permit for Owner and Family
    </>
  ),
};

const projects = [
  {
    title: "Anwa Aria",
    developer: dev("omniyat.png", 295, 73, "Omniyat"),
    images: thumbs("Anwa Aria by Omniyat", ["Omniyat-thumb-1.png", 232, 217], ["Omniyat-thumb-2.png", 232, 217], ["Omniyat-thumb-3.png", 233, 276]),
    description:
      "Located within the harmonious Maritime City, Anwa Aria artfully blends the urban lifestyle with waterside living. From studios and apartments to breathtaking penthouses and seafront townhouses, Anwa Aria’s meticulously crafted residences cater to every need.",
    features: [visa, tax, { icon: fi.price, text: "Starting from: AED 2.15M" }, { icon: fi.pin, text: "Dubai Maritime City" }],
  },
  {
    title: "T2 Bayview",
    developer: dev("emaar.png", 194, 74, "Emaar"),
    images: thumbs("Bayview by Emaar", ["Rectangle-115.png", 233, 217], ["Rectangle-116.png", 233, 217], ["Rectangle-95.png", 232, 277]),
    description:
      "Overlooking the azure waters of the Arabian Gulf, Bayview is a coastal paradise nestled at the heart of Emaar Beachfront, Dubai Harbour. The project’s architectural vision, innovative interiors, and luxurious furnishings will leave residents spellbound and yearning for more.",
    features: [
      visa,
      tax,
      { icon: fi.price, text: "Starting from: AED 3.1M" },
      { icon: fi.bed, text: "Bedroom Range: 4, with 5 BD Penthouses" },
      { icon: fi.pin, text: "Location: Emaar Beachfront, Dubai Harbour" },
    ],
  },
  {
    title: "Shobha Heartland II",
    developer: dev("shobha.png", 221, 80, "Sobha"),
    images: thumbs("Sobha Hartland II", ["Rectangle-51.png", 271, 252], ["Rectangle-91.png", 271, 252], ["Rectangle-52.png", 271, 322]),
    description:
      "Sobha Hartland II is a stunning waterside residential community just a heartbeat away from the Metropolis. With breathtaking vistas of Dubai’s majestic skyline, our Riverside Crescent apartments offer a plethora of world-class amenities tailored to your every desire.",
    features: [
      visa,
      tax,
      { icon: fi.price, text: "Starting from: AED 1.57M" },
      { icon: fi.bed, text: "Bedroom Range: 1-2" },
      { icon: fi.keys, text: "Area: 8 Million Sq Ft" },
      { icon: fi.pin, text: "Location: Mohammed Bin Rashid City, Dubai" },
    ],
  },
  {
    title: "Shobha Reserve",
    developer: dev("shobha.png", 221, 80, "Sobha"),
    images: thumbs("Sobha Reserve", ["Rectangle-123.png", 241, 224], ["Rectangle-124.png", 240, 224], ["Rectangle-125.png", 241, 286]),
    description:
      "Jouri Hills is a world-class residential golf destination offering luxury homes and leisure facilities amidst two internationally-acclaimed championship golf courses, creating an unmatched lifestyle experience in the heart of new Dubai.",
    features: [
      visa,
      tax,
      { icon: fi.price, text: "Starting from: AED 7.68M" },
      { icon: fi.bed, text: "Bedroom Range: 1-2" },
      { icon: fi.pin, text: "Location: Wadi Al Safa, Dubai" },
    ],
  },
];

const reviews = [
  {
    name: "Koreskalp",
    text: "can only recommend Prestige Luxury Real Estate and Emma O’Donnell in particular!\n\nWe were having a terrible experience with a shady agency when we found Emma and Prestige Luxury by chance. They helped us secure an amazing apartment at the right price within a matter of days. They arranged for everything and went the extra mile to accommodate my working schedule by meeting us after working hours and making sure everything went well with the landlord, the property and us.\n\nAnyone reading this, be sure that you are working with true professionals and ask for Emma. She is nice, efficient and truly conscientious.",
  },
  {
    name: "Sharmila Mohnani",
    text: "I was very lucky to meet Mr. Ilyas Slah from Prestige Luxury Real Estate.\nHe is an extremely vibrant, coordinative, brilliant human being with a lovely aura around him. Very helpful and patient.\nMy husband and myself were extremely impressed with him. He was completely dedicated till the end.\nWe wish him excellent Success in his future.\nWe wish Success to Prestige Luxury Real Estate.",
  },
  {
    name: "Skalwold Leta",
    text: "Elmira is excellent to work with. She returns your calls and texts immediately and is just as responsive to landlords while she is trying to find you a new home. I also really appreciated her knowledge of what is available and whether your rent price and expectation is above or below what is available . We are very excited for our home and grateful for a successful experience with Elmira!",
  },
];

export default function ProjectsForSalePage() {
  return (
    <>
      <ShowcaseHero
        background="/wp-content/uploads/2023/05/Rectangle-53-1.png"
        title="Prestigious Luxury Villas in Dubai"
        text={
<p className="max-w-[560px]">Indulge in a prestigious lifestyle and elevate your living experience</p>
        }
        form={
          <div className="mx-auto max-w-[620px] bg-white px-6 pb-10 pt-6 text-ink sm:px-[50px] sm:pb-[50px] sm:pt-5">
            <LeadForm form={FORM} fields={contactFields} redirectTo={REDIRECT} />
          </div>
        }
        benefits={<BenefitRow />}
      />

      <section id="projects" className="scroll-mt-4 px-5 pt-12 md:px-[100px]">
        <LpHeading className="mx-auto max-w-[1100px] text-[30px] md:text-[40px] lg:text-[48px] lg:leading-[80px]">
          Choose From Many Prestigious Properties and Enjoy a Luxurious Lifestyle
        </LpHeading>
      </section>

      {projects.map((p, i) => {
        const [first, ...rest] = p.title.split(" ");
        return (
          <ProjectBlock
            key={p.title}
            n={i + 1}
            title={
              <>
                {first}
                <br />
                {rest.join(" ")}
              </>
            }
            developer={p.developer}
            mediaFirst={i % 2 === 0}
            media={
              <MediaFrame>
                <Gallery images={p.images} layout="grid" columns={3} aspect="aspect-[232/217]" />
              </MediaFrame>
            }
            description={p.description}
            features={p.features}
            actions={
              <>
                <a href="#contact" className={btn.black}>
                  View Catalog
                </a>
                <a href="#contact" className={btn.grey}>
                  Read More
                </a>
              </>
            }
          />
        );
      })}

      <PhotoBand
        heading={
          <>
            We Work With Top Developers
            <br />
            in the UAE
          </>
        }
      >
        <Media
          src="/wp-content/uploads/2023/10/Group-23964-1024x166.png"
          alt="Logos of the developers we work with"
          width={1024}
          height={166}
          className="mx-auto h-auto w-full max-w-[1024px]"
        />
      </PhotoBand>

      <div id="benefits" className="scroll-mt-4">
        <AssociateSection
          heading="Associate With Prestige. Reflect Your Luxury."
          paragraphs={[
            "Properties in Dubai are designed to offer you a lifestyle that is unparalleled in terms of luxury and prestige.",
            "With a commitment to high-quality design and attention to detail, each one of these properties is unique in its own way.",
            "These luxurious properties are located in some of the most sought-after areas in Dubai, providing you with the best of both worlds: the convenience of city living and the comfort of a lavish lifestyle.",
            "Prestige Luxury aims to provide you with a unique living experience marked by sophistication, elegance, and opulence.",
            "Whether you are looking for a spacious apartment or a lavish villa, these properties are designed to meet your needs and exceed your expectations.",
          ]}
          action={
            <a href="#contact" className={`${btn.black} px-8 py-3 md:text-[32px]`}>
              Book a Free Consultation
            </a>
          }
        />
      </div>

      <Reviews id="testimonials" title="What our Clients are Saying" reviews={reviews} />

      <section id="contact" className="scroll-mt-4 px-5 pb-20 pt-16 md:px-[100px] md:pb-[100px]">
        <LpHeading className="mx-auto max-w-[1100px]">Invest in a Lifestyle of Prestige and Luxury</LpHeading>
        <div className="mx-auto mt-12 w-full max-w-[640px] rounded-[15px] border-[3px] border-white bg-black p-6 sm:p-[50px]">
          <h2 className="mb-6 text-center text-[32px] font-extrabold leading-tight md:text-[48px]">Get in Touch</h2>
          <LeadForm form={FORM} fields={contactFields} redirectTo={REDIRECT} dark />
        </div>
      </section>

      <LinksFooter
        year={false}
        links={[
          { key: "projects", label: "Projects", href: "#projects" },
          { key: "benefits", label: "Benefits", href: "#benefits" },
          { key: "map", label: "Map" },
          { key: "lifestyle", label: "Lifestyle", href: "#benefits" },
          { key: "testimonials", label: "Testimonials", href: "#testimonials" },
        ]}
      />
    </>
  );
}
