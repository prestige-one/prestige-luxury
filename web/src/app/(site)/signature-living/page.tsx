// /signature-living/ — Elementor page 299944, rebuilt section by section with the original text.
// Background videos of the original are replaced by their overlay colours (only the hero keeps its YouTube loop on desktop).
import type { Metadata } from "next";
import Media from "@/components/Media";
import Link from "next/link";
import { getPage, seoMetadata } from "@/lib/content";

const page = getPage("/signature-living/")!;
export const metadata: Metadata = {
  ...seoMetadata(page),
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

function YouTube({ id, title }: { id: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
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

      {/* Play it forward */}
      <section className="bg-[#1d1640] px-[30px] py-[60px] md:p-[50px] lg:min-h-screen lg:content-center">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-[44px] tracking-[-2px] text-white md:text-[70px] md:tracking-[-3px]">Play it forward</h2>
          <p className={`${serif} mx-auto mt-4 text-[19px] leading-[1.8] text-white/75`}>
            We’ve worked for over a year to offer you the best possible web design solution. Now, all you need to do is press ‘Play’.
          </p>
          <div className="mt-10">
            <YouTube id="kB4U67tiQLA" title="Play it forward" />
          </div>
        </div>
      </section>

      {/* Revolution */}
      <section className="bg-[#0b0a33] px-[30px] py-[90px] lg:min-h-screen lg:content-center">
        <div className="mx-auto max-w-[1140px] text-center">
          <h2 className="text-[56px] tracking-[-3px] text-white md:text-[104px]">Revolution</h2>
          <p className={`${serif} mx-auto mt-4 max-w-[760px] text-[21px] leading-[1.8] text-white/75`}>
            We all want to change the world. But when you talk about destruction, don’t you know that you can count me out. Don’t you know it’s gonna be
            alright?
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              href="/contact-us/"
              className="rounded-full bg-[#4054b2] px-10 py-[18px] text-[15px] font-medium leading-none tracking-[0.7px] text-white transition-colors hover:bg-[#4054b2]/75"
            >
              Download Now
            </Link>
            <Link
              href="/contact-us/"
              className="rounded-full bg-white px-10 py-[18px] text-[15px] font-medium leading-none tracking-[0.7px] text-[#4054b2] transition-colors hover:bg-white/80"
            >
              Take a Tour
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio / attitude (the original phone mock-up image is no longer available) */}
      <section className="bg-white px-[30px] py-[60px] md:py-[100px] lg:min-h-screen lg:content-center">
        <div className="mx-auto max-w-[1140px] md:grid md:grid-cols-2 md:gap-12">
          <div className="text-center md:text-left">
            <Icon name="inbox" className="mx-auto h-[33px] w-[33px] text-[#1e73be] md:mx-0" />
            <h2 className="mt-8 text-[34px] capitalize leading-[1.2] tracking-[-2px] text-[#282828] md:text-[49px] md:tracking-[-3px]">
              A good portfolio will get you an interview. A good attitude will get you a job.
            </h2>
          </div>
          <p className={`${serif} mt-6 self-end text-center text-[17px] leading-[1.8] md:mt-0 md:text-left`}>
            We have a great opportunity for experienced photographers to join our team. Yes, we do need you to already own a camera. No, your iPhone camera
            won’t cut it. Go on, ‘Shoot’ us a message.
          </p>
        </div>
      </section>

      {/* Surf's up */}
      <section className="bg-[#0f3d56] px-[30px] py-[100px] text-center md:py-[140px]">
        <div className="mx-auto max-w-[760px]">
          <h2 className="text-[44px] tracking-[-2px] text-white md:text-[65px] md:tracking-[-3px]">Surf&apos;s up!</h2>
          <p className={`${serif} mt-4 text-[19px] leading-[1.8] text-white`}>
            There are 23 million estimated surfers around the world. The longest amount of time spent surfing one wave is 37 minutes. There are many other
            reasons you should get on board.
          </p>
          <div className="mt-8">
            <PillButton href="/contact-us/" tone="green">
              Catch Our Wave
            </PillButton>
          </div>
        </div>
      </section>

      {/* Your journey */}
      <section className="bg-[#5c3a1c] p-5 md:py-[100px]">
        <div className="mx-auto max-w-[560px] bg-white px-[30px] py-[50px] text-center">
          <h2 className="text-[31px] font-semibold text-black">Your Journey</h2>
          <div className="mx-auto mt-4 h-1 w-16 bg-[#d8d8d8]" />
          <p className={`${serif} mt-5 text-[17px] leading-[1.8]`}>
            Desert Tiptoes Inc. is a company that set forth to boldly go where no other company has gone before, and to get as many individuals to walk barefoot
            across the Sahara desert, leaving beautiful and temporary foot marks behind. When we started, we had no clear vision as to why we wanted to get
            people to do that. Today, 20 years later, we are still kinda confused.
          </p>
          <div className="mt-6">
            <PillButton href="/contact-us/">Take The First Step</PillButton>
          </div>
        </div>
      </section>

      {/* Do what I want */}
      <section className="bg-[#001110] px-[30px] py-[90px] text-center lg:min-h-screen lg:content-center">
        <Icon name="heart" className="mx-auto h-12 w-12 text-white" />
        <h2 className="mt-6 text-[44px] leading-tight tracking-[-2px] text-white md:text-[93px] md:tracking-[-3px]">Do what I want, not what I say.</h2>
        <p className={`${serif} mt-6 text-[13px] uppercase leading-[1.5] tracking-[6px] text-white`}>Learn More</p>
      </section>

      {/* Hello */}
      <section className="bg-white px-[30px] py-[60px] md:p-[50px] lg:min-h-screen lg:content-center">
        <div className="mx-auto grid max-w-[1140px] items-center gap-10 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h2 className="text-[44px] capitalize leading-[1.2] tracking-[-3px] text-[#282828] md:text-[63px]">Hello.</h2>
            <p className={`${serif} pb-5 pt-2.5 text-[17px] leading-[1.8]`}>
              I love you, won’t you tell me your name? These immortal words by legendary musician Jim Morrison are still as relevant today, in this digital age,
              as they were back then.
            </p>
            <PillButton href="/contact-us/">Let&apos;s Meet</PillButton>
          </div>
          <YouTube id="kB4U67tiQLA" title="Hello" />
        </div>
      </section>

      {/* Writing, made simple (the original laptop mock-up image is no longer available) */}
      <section className="bg-[#0a1600] px-[30px] py-[90px] text-center">
        <h2 className="text-[44px] tracking-[-2px] text-white md:text-[70px] md:tracking-[-3px]">Writing, made simple.</h2>
        <p className={`${serif} mx-auto mt-4 max-w-[720px] text-[19px] leading-[1.8] text-white/75`}>
          Everyone can write, but not everyone is a writer. What makes the difference is the keen eye for detail and beauty.
        </p>
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

      {/* Design is an opportunity */}
      <section className="bg-[#0b0a33] px-[30px] py-[90px] lg:min-h-screen lg:content-center">
        <div className="mx-auto max-w-[1140px] text-center">
          <h2 className="text-[44px] tracking-[-2px] text-white md:text-[75px] md:tracking-[-3px]">Design is an opportunity</h2>
          <p className={`${serif} mx-auto mt-4 max-w-[760px] text-[19px] leading-[1.8] text-white/75`}>
            We want to create something that does more than just look nice on a page. How are the creative stories of the future going to look like?
          </p>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {(
              [
                { icon: "camera", title: "Photographer", text: "The photo occurs in a broader scope than the snap of the camera. It starts with the first glance of attention" },
                { icon: "video", title: "Video Art", text: "We all shun away from it on museums, but in the real world, video art can, and does, make a difference" },
                { icon: "desktop", title: "Web Design", text: "Endless design possibilities start with a single possibility that wants to expand further than ever before" },
              ] as const
            ).map((b) => (
              <div key={b.title}>
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white text-white">
                  <Icon name={b.icon} className="h-8 w-8" />
                </span>
                <h3 className="mt-6 text-[20px] font-medium text-white">{b.title}</h3>
                <p className={`${serif} mt-3 text-[17px] leading-[1.8] text-white/75`}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
