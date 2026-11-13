// Sections of the multi-project landing pages: /projects-for-sale/ and /projects-for-sale-arabic/
import Media from "@/components/Media";
import { LOGO_WHITE, LpHeading } from "./shared";

type Img = { src: string; width: number; height: number };

const numberImg = (n: number) => ({ src: `/wp-content/uploads/2023/04/0${n}.png`, width: 146, height: 94 });

/** Hero: city background, logo bar, big title + text on one side, form on the other, then the benefits row */
export function ShowcaseHero({
  background,
  title,
  text,
  form,
  benefits,
  titleClass = "text-[40px] md:text-[56px] xl:text-[64px] xl:leading-[90px]",
}: {
  background: string;
  title: string;
  text: React.ReactNode;
  form: React.ReactNode;
  benefits: React.ReactNode;
  titleClass?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <Media src={background} alt="" fill priority tone="ink" sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#000000_3%,#02071200_77%)] opacity-[0.97]" />
      <div className="relative">
        <div className="border-b-2 border-white bg-black px-5 py-[15px] md:px-[100px]">
          <Media src={LOGO_WHITE.src} alt="Prestige Luxury Real Estate" tone="ink" width={LOGO_WHITE.width} height={LOGO_WHITE.height} priority className="h-auto w-[150px] md:w-[199px]" />
        </div>
        <div className="grid items-center gap-12 px-5 py-16 md:px-[100px] md:py-[100px] lg:grid-cols-2">
          <div>
            <h1 className={`font-extrabold leading-[1.2] ${titleClass}`}>{title}</h1>
            <div className="mt-6 text-[22px] font-light leading-[1.5] md:text-[32px] md:leading-[50px]">{text}</div>
          </div>
          <div id="contact-top">{form}</div>
        </div>
        <div className="px-5 pb-16 md:px-[100px] md:pb-[100px]">{benefits}</div>
      </div>
    </section>
  );
}

export type ProjectFeature = { icon: Img; text: React.ReactNode };

export const featureIcons = {
  visa: { src: "/wp-content/uploads/2023/04/golden-visa-icon.png", width: 45, height: 54 },
  tax: { src: "/wp-content/uploads/2023/04/money-bag-3.png", width: 46, height: 46 },
  price: { src: "/wp-content/uploads/2023/04/money-home.png", width: 48, height: 48 },
  pin: { src: "/wp-content/uploads/2023/04/home-pin.png", width: 57, height: 57 },
  bed: { src: "/wp-content/uploads/2023/04/bed-sleep.png", width: 60, height: 60 },
  keys: { src: "/wp-content/uploads/2023/04/keys.png", width: 51, height: 52 },
};

export function FeatureList({ items, className = "" }: { items: ProjectFeature[]; className?: string }) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((f, i) => (
        <li key={i} className="flex items-center gap-4 text-[18px] font-light leading-[1.4] md:text-[24px]">
          <Media src={f.icon.src} alt="" width={f.icon.width} height={f.icon.height} className="h-[40px] w-[40px] shrink-0 object-contain md:h-[46px] md:w-[46px]" />
          <span>{f.text}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One project: "01 ANWA ARIA" title row (with the developer logo), then pictures on one side and
 * description, key facts and buttons on the other.
 */
export function ProjectBlock({
  n,
  title,
  developer,
  media,
  description,
  features,
  actions,
  footer,
  mediaFirst = true,
  titleClass = "text-[28px] md:text-[36px] md:leading-[45px]",
}: {
  n: number;
  title: React.ReactNode;
  developer?: Img & { alt: string };
  media: React.ReactNode;
  description: string;
  features: ProjectFeature[];
  actions: React.ReactNode;
  footer?: React.ReactNode;
  mediaFirst?: boolean;
  titleClass?: string;
}) {
  return (
    <section className="px-5 py-12 md:px-[100px] md:py-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Media src={numberImg(n).src} alt="" width={146} height={94} className="h-auto w-[90px] md:w-[146px]" />
            <h3 className={`font-bold uppercase ${titleClass}`}>{title}</h3>
          </div>
          {developer && (
            <Media src={developer.src} alt={developer.alt} width={developer.width} height={developer.height} className="h-auto w-[110px] md:w-auto" />
          )}
        </div>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-[100px]">
          <div className={mediaFirst ? "" : "lg:order-2"}>{media}</div>
          <div>
            <p className="mb-8 text-[18px] font-light leading-[1.6] md:text-[24px] md:leading-[1.6]">{description}</p>
            <FeatureList items={features} />
            <div className="mt-10 flex flex-wrap gap-5">{actions}</div>
          </div>
        </div>
        {footer}
      </div>
    </section>
  );
}

/** Bordered frame (3px #F4F4F4, 15px radius) that holds a project's pictures */
export function MediaFrame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[15px] border-[3px] border-[#F4F4F4] p-4 md:p-5">{children}</div>;
}

/** Dark photo band with a heading (and logos or icons) */
export function PhotoBand({ heading, children }: { heading: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-[100px] md:pb-[200px] md:pt-[150px]">
      <Media src="/wp-content/uploads/2023/04/Rectangle-39.png" alt="" fill tone="ink" sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative">
        <LpHeading>{heading}</LpHeading>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

/** "Associate With Prestige" – tall photo next to the text and a button */
export function AssociateSection({ heading, paragraphs, action }: { heading: string; paragraphs: string[]; action: React.ReactNode }) {
  return (
    <section className="px-5 py-16 md:px-[100px] md:py-[100px]">
      <LpHeading className="mx-auto max-w-[1300px]">{heading}</LpHeading>
      <div className="mx-auto mt-14 grid max-w-[1400px] items-center gap-12 lg:grid-cols-2">
        <Media src="/wp-content/uploads/2023/04/Rectangle-44.png" alt="" width={651} height={1075} className="mx-auto h-auto w-full max-w-[520px]" />
        <div className="text-[18px] font-light leading-[1.6] md:text-[24px] md:leading-[1.65]">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="mb-[1em]">
              {p}
            </p>
          ))}
          <div className="mt-10">{action}</div>
        </div>
      </div>
    </section>
  );
}
