import type { Metadata } from "next";
import Link from "next/link";
import { team } from "@/lib/team";
import Media from "@/components/Media";
import { CtaBanner } from "@/components/info/blocks";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = seoMetadata(getPage("/meet-the-team/")!);

export default function MeetTheTeamPage() {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Meet the Team", path: "/meet-the-team/" }]} />
      <section className="py-16 md:py-[100px]">
        <Container>
          <div className="mx-auto mb-12 max-w-[760px] text-center md:mb-16">
            <h1 className="font-heading text-[30px] font-medium leading-[1.2] text-ink md:text-[42px]">The People Behind Prestige Luxury</h1>
            <p className="mt-4 text-[17px] font-light text-ink md:text-[19px]">Exceptional real estate experiences begin with exceptional people.</p>
            <p className="mt-4 text-[15px] leading-[1.75] text-muted">
              Meet the dedicated professionals behind Prestige Luxury Real Estate, bringing together local and international market
              knowledge, industry experience and personalised expertise to help clients buy, sell, rent and invest in Dubai with confidence.
            </p>
          </div>

          <ul className="mx-auto grid max-w-[980px] gap-8 md:grid-cols-2 md:gap-10">
            {team.map((m) => (
              <li key={m.name}>
                <article className="group h-full overflow-hidden rounded-[10px] border border-line bg-white transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_40px_rgba(0,0,0,0.09)]">
                  <Link href={`/meet-the-team/${m.slug}/`} aria-label={`Read ${m.name}’s biography`} className="relative block aspect-[4/5] overflow-hidden bg-mist">
                    <Media
                      src={m.image}
                      alt={`${m.name}, ${m.role}`}
                      fill
                      sizes="(min-width: 768px) 470px, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </Link>
                  <div className="px-7 pb-8 pt-6">
                    <h2 className="text-[21px] font-medium text-ink"><Link href={`/meet-the-team/${m.slug}/`} className="hover:underline underline-offset-4">{m.name}</Link></h2>
                    <p className="mt-1 text-[13px] uppercase tracking-[0.08em] text-muted">{m.role}</p>
                    <span className="mt-4 block h-[2px] w-12 bg-ink" aria-hidden />
                    <p className="mt-4 text-[14.5px] leading-[1.8] font-light text-body">{m.biography[0]}</p>
                    <Link href={`/meet-the-team/${m.slug}/`} aria-label={`Read ${m.name}’s full biography`} className="mt-5 inline-flex min-h-11 items-center gap-3 border-b border-ink text-[14px] font-medium text-ink">Read full biography <span aria-hidden="true">↗</span></Link>
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
