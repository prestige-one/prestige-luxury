// /signature-living/ — Elementor page 299944.
//
// The original carried the agency's real sustainability story (the UAE Plan 2050 targets, the
// Green Group partnership and Dubai's first solar-powered residential building in Jumeirah
// Village) interleaved with unedited sections of the Elementor template it was built from —
// "Play it forward", "Surf's up!", a photographer job advert, and a company called Desert
// Tiptoes Inc. that walks people barefoot across the Sahara. Only the agency's own content is
// kept here; the template copy has been removed.
// Background videos of the original are replaced by their overlay colours (only the hero keeps its YouTube loop on desktop).
import type { Metadata } from "next";
import Media from "@/components/Media";
import Link from "next/link";
import { CtaBanner } from "@/components/info/blocks";
import { getPage, seoMetadata } from "@/lib/content";
import { communityPhoto } from "@/lib/imagery";

const ctaImage = communityPhoto("Jumeirah Village Circle", { size: "full" }) ?? "/wp-content/uploads/2019/05/jumeirah-village-circle.jpg";

const page = getPage("/signature-living/")!;
export const metadata: Metadata = {
  ...seoMetadata(page),
  // WordPress titled this "Signature Living", but every word on it is about sustainability.
  // The URL is kept so existing links and rankings survive; only the title now matches.
  title: { absolute: "Sustainable Living | Prestige Luxury Real Estate" },
  description:
    "Sustainable living, a new era of Dubai: Prestige Real Estate in partnership with Green Group supports Dubai’s first solar-powered residential building in Jumeirah Village.",
};

const serif = "font-['Lora',Georgia,'Times_New_Roman',serif]";

function PillButton({ href, children, tone = "dark" }: { href: string; children: React.ReactNode; tone?: "dark" | "blue" | "white" | "green" }) {
  const tones = {
    dark: "bg-[#282828] text-white hover:bg-black",
    blue: "bg-[#4054b2] text-white hover:bg-[#4054b2]/75",
    white: "bg-white text-[#4054b2] hover:bg-white/80",
    green: "border border-[#61ce70] bg-[#61ce70] text-white hover:bg-[#61ce70]/40",
  }[tone];
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-4 rounded-full px-10 py-[15px] text-[14px] font-medium leading-none tracking-[0.7px] transition-colors ${tones}`}
    >
      {children}
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="m1.5 1 5 5-5 5" />
      </svg>
    </Link>
  );
}

function Icon({ name, className = "" }: { name: "inbox" | "heart" | "quote" | "camera" | "video" | "desktop"; className?: string }) {
  const paths = {
    inbox: <path d="M3 13h5l1.5 3h5L16 13h5M5 5h14l2 8v6H3v-6z" />,
    heart: <path d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.3 4.5 7.4 4.5c2 0 3.6 1.2 4.6 2.8 1-1.6 2.6-2.8 4.6-2.8 3.1 0 5.4 2.9 4.4 6.2C19.5 15.4 12 20 12 20Z" />,
    quote: <path d="M9.5 6C6 7.5 4 10.4 4 14v4h6v-6H7c0-2.3 1.2-4 3.3-5ZM19.5 6C16 7.5 14 10.4 14 14v4h6v-6h-3c0-2.3 1.2-4 3.3-5Z" />,
    camera: (
      <>
        <path d="M3 8h4l2-3h6l2 3h4v11H3z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    video: <path d="M3 7h12v10H3zM15 10.5 21 7v10l-6-3.5" />,
    desktop: <path d="M3 4h18v12H3zM9 20h6M12 16v4" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" className={className} aria-hidden>
      {paths[name]}
    </svg>
  );
}

export default function SignatureLivingPage() {
  return (
    <>
      {/* Hero: black with background video */}
      <section className="relative flex min-h-[612px] items-center overflow-hidden bg-black md:min-h-[800px] lg:min-h-[calc(100vh-80px)]">
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
          <iframe
            src="https://www.youtube-nocookie.com/embed/7uuexxd2VIQ?autoplay=1&mute=1&loop=1&playlist=7uuexxd2VIQ&controls=0&start=22&playsinline=1&modestbranding=1&rel=0"
            title="Sustainable living background video"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-[1140px] px-5 md:grid-cols-2">
          <div>
            <h1 className="text-[40px] font-semibold uppercase leading-tight text-white md:text-[65px]">Sustainable Living</h1>
            <p className="mt-3 text-[16px] font-light leading-[1.8] text-[#bfbfbf]">A NEW ERA OF DUBAI</p>
            <a
              href="#solar-sustainability"
              className="mt-8 inline-block bg-white px-[45px] py-[15px] text-[15px] font-semibold uppercase text-black transition-colors hover:bg-[#626262] hover:text-white"
            >
              Read More
            </a>
          </div>
        </div>
      </section>

      {/* Solar sustainability */}
      <section id="solar-sustainability" className="scroll-mt-20 bg-white px-[30px] py-[60px]">
        <div className="mx-auto grid max-w-[1140px] items-center gap-10 md:grid-cols-2">
          <div className="text-center md:pl-[20%] md:pr-[5%] md:text-left">
            <h2 className="text-[38px] leading-[1.05] tracking-[-2px] text-[#282828] md:text-[45px] md:tracking-[-3px]">
              SOLAR
              <br />
              SUSTAINABILITY
            </h2>
            <div className={`${serif} space-y-4 py-5 text-[17px] leading-[1.8]`}>
              <p>
                The UAE Plan 2050 for sustainability aims to cut CO2 emissions by 70%, increase clean energy use by 50% and improve energy efficiency by 40% by
                the middle of the century for a sustainable future.
              </p>
              <p>
                Prestige Real Estate in partnership with Green Group is committed in supporting sustainable business activities and building a green economy for
                future generations. For us sustainability is the smart way!
              </p>
              <p>
                Going Green in Jumeirah Village, Dubai – First solar-powered residential building in heart of Dubai as a step towards converging luxury living with
                sustainability. Creating sustainable residential environment in eco-friendly building is an important goal for the future. Green Group absolutely
                bleeds 21st century tech. In addition to boasting features ranging from LED lighting and Nest thermostats to introduce sustainability as a
                lifestyle.
              </p>
              <p>
                It is Dubai’s first solar-powered residential building in Jumeirah Village based on sustainability and we hope that the success of this program
                will bring more attention to living a sustainable lifestyle
              </p>
            </div>
            <PillButton href="/contact-us/">Get Started</PillButton>
          </div>
          <div className="hidden md:block">
            <Media
              src="/wp-content/uploads/2020/10/Cam-Ext-003-01-Composite_00000-scaled.jpg"
              alt="Solar-powered residential building in Jumeirah Village"
              width={2560}
              height={1440}
              sizes="(min-width: 1140px) 570px, 50vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="grid bg-[#0d1b2a] md:grid-cols-2">
        <div className="bg-[#4054b2] px-[45px] py-[60px] text-center md:py-[100px]">
          <Icon name="quote" className="mx-auto h-10 w-10 text-white" />
          <p className={`${serif} mt-6 text-[22px] leading-[1.8] text-white md:text-[30px]`}>THOSE WHO DON’T THINK ABOUT ENERGY AREN’T THINKING ABOUT THE FUTURE</p>
          <p className="mt-6 text-[20px] text-white md:text-[26px]">MOHAMMED BIN RASHID AL MAKTOUM</p>
          <p className="mt-1 text-[16px] text-white md:text-[21px]">VICE PRESIDENT AND RULER OF DUBAI</p>
        </div>
        <div className="relative hidden min-h-[320px] md:block">
          <Media src="/wp-content/uploads/2020/10/Cam-Ext-003-01-Composite_00000-1067x600.jpg" alt="" fill tone="ink" sizes="50vw" className="object-cover opacity-60" />
        </div>
      </section>

      <CtaBanner
        image={ctaImage}
        title="Looking for a home in Jumeirah Village?"
        lines={["Our brokers cover the community every day — ask us what is available now."]}
        cta={{ label: "See Properties in JVC", href: "/area/jumeirah-village-circle/" }}
      />
    </>
  );
}
