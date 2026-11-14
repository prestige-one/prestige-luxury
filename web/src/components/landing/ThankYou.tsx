// Thank-you pages the landing-page forms redirect to (/thank-you-vista/, /thank-you-embankment/, ...)
import Media from "@/components/Media";
import Link from "next/link";
import { LogoBar, LpHeading, MiniFooter, btn } from "./shared";

export function ThankYouPage({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <LogoBar
        action={
          <Link href="/contact-us/" className="text-[16px] font-bold text-black transition-opacity hover:opacity-70">
            Contact
          </Link>
        }
      />
      <main className="px-5 pb-20 md:px-[100px] md:pb-[100px]">
        <div className="py-16 text-center md:py-[100px]">
          <h1 className="text-[48px] font-extrabold leading-none md:text-[72px] lg:text-[96px]">Thank You!</h1>
          <p className="mt-8 text-[22px] leading-snug md:text-[36px] md:leading-[45px]">One of our specialists will be in contact with you shortly</p>
        </div>
        {children}
      </main>
      <MiniFooter />
    </>
  );
}

/** Card with optional title, image and a white button (brochure, factsheet, 3D tour) */
export function DocCard({
  title,
  image,
  href,
  label,
  bordered = false,
  tour = false,
}: {
  title?: string;
  image: { src: string; width: number; height: number };
  href: string;
  label: string;
  bordered?: boolean;
  /** 3D tour style: big title and transparent button */
  tour?: boolean;
}) {
  const external = { target: "_blank", rel: "noopener" };
  return (
    <div className="flex flex-col items-center text-center">
      {title && (
        <h3 className={`mb-6 font-extrabold leading-tight ${tour ? "text-[30px] md:text-[48px]" : "text-[26px] md:text-[38px]"}`}>{title}</h3>
      )}
      <a href={href} {...external} className="block w-full overflow-hidden transition-opacity hover:opacity-85">
        <Media
          src={image.src}
          alt={title ?? label}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 33vw, 100vw"
          className={`h-auto w-full ${bordered ? "rounded-[15px] border-[3px] border-white" : "rounded-[15px]"}`}
        />
      </a>
      <a
        href={href}
        {...external}
        className={
          tour
            ? "mt-4 px-4 py-3 text-[24px] text-white underline-offset-8 transition hover:underline md:text-[32px]"
            : `${btn.white} mt-6 font-medium`
        }
      >
        {label}
      </a>
    </div>
  );
}

/** "ORRA The Embankment – Take A 3D Tour" block used on both Embankment thank-you pages */
export function EmbankmentTours() {
  const tour = (id: string) => `https://kuula.co/share/collection/${id}?logo=-1&info=0&fs=1&vr=1&zoom=1&sd=1&initload=0&thumbs=1`;
  return (
    <section>
      <LpHeading>ORRA The Embankment</LpHeading>
      <LpHeading as="h3" className="mt-16 md:mt-[100px]">
        Take A 3D Tour That Suits Your Lifestyle at The Embankment
      </LpHeading>
      <div className="mx-auto mt-12 grid max-w-[1400px] gap-12 md:grid-cols-2 md:gap-8">
        <DocCard tour title="1 Bedroom Apartment" image={{ src: "/wp-content/uploads/2023/04/11.jpg", width: 916, height: 549 }} href={tour("7vvXZ")} label="Take a 3D Tour" />
        <DocCard tour title="2 Bedroom Apartment" image={{ src: "/wp-content/uploads/2023/04/12.jpg", width: 916, height: 549 }} href={tour("7vvjh")} label="Take a 3D Tour" />
      </div>
    </section>
  );
}
