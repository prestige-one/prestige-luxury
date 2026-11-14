import type { Metadata } from "next";
import Media from "@/components/Media";
import { CtaBanner } from "@/components/info/blocks";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = seoMetadata(getPage("/meet-the-team/")!);

/**
 * The team as the owner published it on prestigeluxury.ae/meet-the-team/ (read 2026-11-14):
 * heading, both intro lines, two people, their titles and their biographies, all verbatim.
 * The portraits are the owner's own uploads, copied across from the live media library.
 *
 * The live page also carries a "Read full biography" link on each card, but it points at "#" —
 * there is no longer biography to open — so it is left out here rather than published as a
 * link that does nothing. Add it back the moment the full biographies exist.
 */
const team = [
  {
    name: "Chris Valentine",
    role: "Real Estate Sales & Leadership | Dubai",
    image: "/wp-content/uploads/2026/11/Chris-Valentine-1.webp",
    text: "With more than 24 years of real estate experience and a Master’s degree in Business Management, Chris Valentine combines extensive industry knowledge with commercial insight and a personal approach to client service.",
  },
  {
    name: "Michael Cullen",
    role: "Real Estate Sales & Leadership | Dubai",
    image: "/wp-content/uploads/2026/11/michael-cullen1.webp",
    text: "With more than two decades of experience in real estate, Michael Cullen has built his career around two key strengths: delivering results through his own property sales and building, developing and leading successful sales teams.",
  },
];

export default function MeetTheTeamPage() {
  return (
    <>
      <section className="py-16 md:py-[100px]">
        <Container>
          <div className="mx-auto mb-12 max-w-[760px] text-center md:mb-16">
            <h1 className="font-heading text-[30px] font-medium leading-[1.2] text-ink md:text-[42px]">The People Behind Prestige Luxury</h1>
            <p className="mt-4 text-[17px] font-light text-ink md:text-[19px]">Exceptional real estate experiences begin with exceptional people.</p>
            <p className="mt-4 text-[15px] leading-[1.75] text-muted">
              Meet the dedicated professionals behind Prestige Luxury Real Estate, bringing together local &amp; International market
              knowledge, industry experience and personalised expertise to help clients buy, sell, rent and invest in Dubai with confidence.
            </p>
          </div>

          <ul className="mx-auto grid max-w-[980px] gap-8 md:grid-cols-2 md:gap-10">
            {team.map((m) => (
              <li key={m.name}>
                <article className="group h-full overflow-hidden rounded-[4px] border border-line bg-white transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_40px_rgba(0,0,0,0.09)]">
                  {/* the portraits are 800x500, so the frame is landscape rather than 3:4 */}
                  <div className="relative aspect-[8/5] overflow-hidden bg-mist">
                    <Media
                      src={m.image}
                      alt={`${m.name}, ${m.role}`}
                      width={800}
                      height={500}
                      sizes="(min-width: 768px) 470px, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <div className="px-7 pb-8 pt-6">
                    <h2 className="text-[21px] font-medium text-ink">{m.name}</h2>
                    <p className="mt-1 text-[13px] uppercase tracking-[0.08em] text-muted">{m.role}</p>
                    <span className="mt-4 block h-[2px] w-12 bg-ink" aria-hidden />
                    <p className="mt-4 text-[14.5px] leading-[1.8] font-light text-body">{m.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner
        image="/wp-content/uploads/2019/06/emaar-downtown-1536x864.jpg"
        title="Exceptional Properties. Expert Advisory. Trusted Relationships."
        cta={{ label: "Speak to a Property Specialist", href: "/contact-us/" }}
      />
    </>
  );
}
