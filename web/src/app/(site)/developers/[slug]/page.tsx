import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import PropertyCard from "@/components/listings/PropertyCard";
import Media from "@/components/Media";
import { Button, Container } from "@/components/ui";
import { developerProperties, developers, getDeveloper, type Developer } from "@/lib/developers";
import { allAreas } from "@/lib/listing-views";
import { slugify } from "@/lib/properties";
import { site } from "@/lib/site";
import { developerLogo, developerLogoClass } from "@/lib/developer-logos";

// Developer URLs are generated from the shared directory data.
export const dynamicParams = false;
export const generateStaticParams = () => developers.map((d) => ({ slug: d.slug }));

type Props = { params: Promise<{ slug: string }> };

/** Listings shown on the page before we point the visitor at a fuller list. */
const MAX_LISTINGS = 12;

/** "https://www.emaar.com/en/" → "emaar.com" */
const prettyUrl = (url: string) => url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");

/** First description paragraph (or the tagline), trimmed to a meta-description length. */
function metaDescription(d: Developer) {
  const source = d.description.find((p) => p && p.trim())?.replace(/\s+/g, " ").trim();
  if (source) return source.length > 158 ? `${source.slice(0, 157).replace(/\s+\S*$/, "")}…` : source;
  const lead = d.tagline ? `${d.name} — ${d.tagline}. ` : `${d.name}, a property developer in Dubai. `;
  return `${lead}Projects, communities and available properties with ${site.name}.`.slice(0, 160);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = getDeveloper(slug);
  if (!d) return {};
  const title = `${d.name} — Dubai Property Developer | ${site.name}`;
  const description = metaDescription(d);
  const path = `/developers/${d.slug}/`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

function jsonLd(d: Developer) {
  const url = `${site.url}/developers/${d.slug}/`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": url,
    name: d.name,
    legalName: d.legalName && d.legalName.toLowerCase() !== d.name.toLowerCase() ? d.legalName : undefined,
    url: d.website || url,
    mainEntityOfPage: url,
    description: d.description.find((p) => p && p.trim())?.replace(/\s+/g, " ").trim() || d.tagline || undefined,
    slogan: d.tagline || undefined,
    foundingDate: d.founded ? String(d.founded) : undefined,
    founder: d.founder ? { "@type": "Person", name: d.founder } : undefined,
    address: d.headquarters ? { "@type": "PostalAddress", addressLocality: d.headquarters } : undefined,
    knowsAbout: d.specialities.length ? d.specialities : undefined,
    sameAs: d.website ? [d.website] : undefined,
    areaServed: d.communities.length ? d.communities.map((c) => ({ "@type": "Place", name: c })) : undefined,
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const enquiryFields: LeadField[] = [
  { name: "name", label: "Name", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "phone", label: "Phone", type: "tel", required: true, half: true },
  { name: "budget", label: "Budget (AED)", half: true },
  { name: "message", label: "Message", type: "textarea" },
];

function Section({ title, children, id, muted = false }: { title: string; children: React.ReactNode; id?: string; muted?: boolean }) {
  return (
    <section id={id} aria-label={title} className={`mt-12 scroll-mt-28 md:mt-16 ${muted ? "rounded-[8px] bg-mist p-5 sm:p-8" : ""}`}>
      <h2 className="mb-6 font-medium leading-[1.25] tracking-[-0.02em] text-ink text-section">{title}</h2>
      {children}
    </section>
  );
}

function LocationPin() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="mt-0.5 shrink-0"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg>;
}

export default async function DeveloperPage({ params }: Props) {
  const { slug } = await params;
  const d = getDeveloper(slug);
  if (!d) notFound();

  const logo = developerLogo(d.slug);

  // Only publish known company facts; registration workflow belongs outside the detail page.
  const facts: { label: string; value: React.ReactNode }[] = [
    ...(d.founded ? [{ label: "Founded", value: String(d.founded) }] : []),
    ...(d.headquarters ? [{ label: "Headquarters", value: d.headquarters }] : []),
    ...(d.founder ? [{ label: "Founder / Chairman", value: d.founder }] : []),
    ...(d.website
      ? [
          {
            label: "Website",
            value: (
              <a
                href={d.website}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-accent underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {prettyUrl(d.website)}
              </a>
            ),
          },
        ]
      : []),
  ];

  // Communities only link out when an /area/ page actually exists for them.
  const areaSlugs = new Set(allAreas().map((a) => a.slug));
  const communities = d.communities.map((name) => {
    const s = slugify(name);
    return { name, href: areaSlugs.has(s) ? `/area/${s}/` : null };
  });

  const matched = developerProperties(d);
  const listings = matched.slice(0, MAX_LISTINGS);
  // A "see them all" link only makes sense when one area page covers this developer's stock.
  const areaLinks = communities.filter((c) => c.href);
  const moreHref = matched.length > listings.length && areaLinks.length === 1 ? areaLinks[0] : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(d) }} />

      <header className="bg-black py-12 text-white md:py-16">
        <Container className="grid items-center gap-9 md:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/65">Developer Collection</p>
            <h1 className="mt-4 text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-[44px]">
              {d.name}
            </h1>
            {d.tagline && <p className="mt-4 text-[15px] leading-[1.7] text-white/85 md:text-[17px]">{d.tagline}</p>}
            <a href="#developer-enquiry" className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-white/60 text-[14px] font-medium focus-visible:outline-white">Speak to a Property Specialist <span aria-hidden="true">↗</span></a>
          </div>
          <div className="flex min-h-[170px] w-full max-w-[340px] items-center justify-center rounded-[8px] bg-white p-8 md:max-w-none">
            {logo ? <Media src={logo} alt={`${d.name} logo`} width={260} height={100} priority unoptimized className={`h-[100px] w-full object-contain ${developerLogoClass(d.slug)}`} /> : <p className="text-center text-[24px] font-medium leading-snug text-black">{d.name}</p>}
          </div>
        </Container>
      </header>
      <nav aria-label="Developer sections" className="border-b border-line bg-white">
        <Container className="flex flex-wrap gap-x-7 gap-y-1 py-3 text-[13px] font-medium text-ink">
          {d.description.length > 0 && <a href="#developer-about" className="inline-flex min-h-11 items-center hover:underline underline-offset-4">Overview</a>}
          {d.projects.length > 0 && <a href="#developer-projects" className="inline-flex min-h-11 items-center hover:underline underline-offset-4">Signature Projects</a>}
          {communities.length > 0 && <a href="#developer-communities" className="inline-flex min-h-11 items-center hover:underline underline-offset-4">Communities</a>}
          {listings.length > 0 && <a href="#developer-properties" className="inline-flex min-h-11 items-center hover:underline underline-offset-4">Available Properties</a>}
          <a href="#developer-enquiry" className="inline-flex min-h-11 items-center hover:underline underline-offset-4">Enquire</a>
        </Container>
      </nav>
      <Container className="pb-16 md:pb-20">

        {d.description.length > 0 && (
          <Section id="developer-about" title={`About ${d.name}`}>
            <div className="max-w-[840px] space-y-4 text-[15px] leading-[1.85] text-body">
              {d.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Section>
        )}

        {facts.length > 0 && (
          <Section title="Key Facts">
            <dl className="grid gap-6 rounded-[8px] border border-line bg-mist p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[12px] uppercase tracking-[0.08em] text-muted">{f.label}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {d.specialities.length > 0 && (
          <Section title="Specialities">
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {d.specialities.map((s) => (
                <li key={s} className="flex items-start gap-3 border-b border-line py-3 text-[14px] leading-relaxed text-body">
                  <span aria-hidden="true" className="text-ink">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {d.projects.length > 0 && (
          <Section id="developer-projects" title="Signature Projects">
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {d.projects.map((p) => (
                <li key={p.name} className="border-b border-line py-3">
                  <h3 className="text-[15px] font-medium leading-snug text-ink">{p.name}</h3>
                  {p.community && <p className="mt-1 text-[13px] leading-relaxed text-muted">{p.community}</p>}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {communities.length > 0 && (
          <Section id="developer-communities" title="Communities">
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {communities.map((c) =>
                c.href ? (
                  <li key={c.name}>
                    <Link
                      href={c.href}
                      className="group flex min-h-11 items-center gap-3 border-b border-line py-3 text-[14px] text-ink transition-colors hover:border-black motion-reduce:transition-none"
                    >
                      <LocationPin /><span className="flex-1">{c.name}</span><span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">↗</span>
                    </Link>
                  </li>
                ) : (
                  <li key={c.name} className="flex min-h-11 items-center gap-3 border-b border-line py-3 text-[14px] text-body">
                    <LocationPin />{c.name}
                  </li>
                ),
              )}
            </ul>
          </Section>
        )}

        {listings.length > 0 && (
          <Section id="developer-properties" title={`Available Properties${matched.length > listings.length ? ` (${listings.length} of ${matched.length})` : ""}`}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
            {moreHref && (
              <div className="mt-8">
                <Button href={moreHref.href!} variant="outline">
                  View all properties in {moreHref.name}
                </Button>
              </div>
            )}
          </Section>
        )}

        <Section id="developer-enquiry" title={`Enquire about ${d.name}`} muted>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
            <div className="text-[15px] leading-[1.85] text-body">
              <p>
                Tell us what you are looking for from {d.name} — a specific project, a community, or simply a budget and a handover date —
                and one of our consultants will come back to you with what is available, including units that never reach the portals.
              </p>
              <p className="mt-4">
                Prefer to talk?{" "}
                <a href={site.phoneHref} className="text-accent underline-offset-4 transition-colors hover:text-ink hover:underline">
                  {site.phone}
                </a>
              </p>
            </div>
            <div className="rounded-[8px] border border-line bg-white p-6 sm:p-8">
              <LeadForm
                form={`Developer enquiry — ${d.name}`}
                fields={enquiryFields}
                submitLabel="Send Enquiry"
                extra={{ developer: d.name, developer_page: `${site.url}/developers/${d.slug}/` }}
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
