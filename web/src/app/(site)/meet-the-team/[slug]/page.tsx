import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "@/components/Media";
import { Button, Container } from "@/components/ui";
import { getTeamMember, team } from "@/lib/team";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => team.map((member) => ({ slug: member.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = getTeamMember((await params).slug);
  if (!member) notFound();
  const title = `${member.name} | ${site.name}`;
  const description = member.biography[0];
  const path = `/meet-the-team/${member.slug}/`;
  return pageMetadata({ title, description, path, image: member.image });
}

export default async function TeamMemberPage({ params }: Props) {
  const member = getTeamMember((await params).slug);
  if (!member) notFound();
  const otherMembers = team.filter((person) => person.slug !== member.slug);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site.url}/meet-the-team/${member.slug}/`,
    mainEntity: {
      "@type": "Person",
      name: member.name,
      jobTitle: member.role,
      image: `${site.url}${member.image}`,
      description: member.biography[0],
      worksFor: { "@type": "Organization", name: site.name, url: site.url },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="bg-black py-12 text-white md:py-16">
        <Container>
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/65">The People Behind Prestige Luxury</p>
          <h1 className="mt-4 text-[34px] font-medium leading-tight tracking-[-0.02em] text-white md:text-[46px]">{member.name}</h1>
          <p className="mt-3 text-[15px] text-white/85">{member.role}</p>
          <p className="mt-1 text-[14px] text-white/65">{member.subtitle}</p>
        </Container>
      </section>
      <section className="py-12 md:py-16" aria-label={`${member.name} biography`}>
        <Container className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[8px] bg-mist">
              <Media src={member.image} alt={member.name} width={800} height={500} priority sizes="(min-width: 1024px) 430px, 100vw" className="h-auto w-full" />
            </div>
            <div className="mt-6 rounded-[8px] bg-black p-6 text-white">
              <h2 className="text-[19px] font-medium">Start a conversation</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-white/75">Discuss your property plans with Prestige Luxury. Mention {member.name} when you get in touch and our team will help with your enquiry.</p>
              <Button href="/contact-us/" variant="light" className="mt-5">Contact Prestige Luxury</Button>
            </div>
          </aside>
          <article>
            <h2 className="mb-6 font-medium text-ink text-section">About {member.name}</h2>
            <div className="space-y-5 text-[15px] leading-[1.9] text-body">
              {member.biography.map((paragraph) => <p key={paragraph.slice(0, 50)}>{paragraph}</p>)}
            </div>
            <div className="mt-9 border-t border-line pt-6">
              <Link href="/meet-the-team/" className="inline-flex min-h-11 items-center gap-3 text-[14px] font-medium text-ink underline underline-offset-4"><span aria-hidden="true">←</span> Meet the team</Link>
            </div>
          </article>
        </Container>
      </section>
      <section aria-labelledby="more-team-title" className="bg-black py-12 text-white md:py-16">
        <Container>
          <h2 id="more-team-title" className="font-medium text-white text-section">More from our team</h2>
          <ul className="mt-7 grid gap-6 lg:grid-cols-2">
            {otherMembers.map((person) => (
              <li key={person.slug}>
                <Link href={`/meet-the-team/${person.slug}/`} aria-label={`View ${person.name}’s profile`}
                  className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-white/25 bg-white/5 transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-white motion-reduce:transition-none sm:flex-row">
                  <div className="relative aspect-[8/5] shrink-0 overflow-hidden bg-white/10 sm:w-[45%]">
                    <Media src={person.image} alt={person.name} fill sizes="(min-width: 1024px) 250px, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-6">
                    <h3 className="text-[21px] font-medium text-white">{person.name}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/70">{person.role}</p>
                    <span className="mt-5 inline-flex items-center gap-3 text-[13px] font-medium text-white">Read full biography <span aria-hidden="true">↗</span></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
