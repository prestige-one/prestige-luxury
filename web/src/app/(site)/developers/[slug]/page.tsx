import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import PropertyCard from "@/components/listings/PropertyCard";
import { developerStatusLabels, monogram, StatusPill } from "@/components/developers/shared";
import { Breadcrumb, Button, Container } from "@/components/ui";
import { developerProperties, developers, getDeveloper, type Developer } from "@/lib/developers";
import { allAreas } from "@/lib/listing-views";
import { slugify } from "@/lib/properties";
import { site } from "@/lib/site";

// The 37 developers in content/developers.json are the only valid URLs.
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 md:mt-16">
      <h2 className="mb-6 border-b border-line pb-3 font-heading text-[22px] font-normal leading-[1.25] text-ink md:text-[26px]">{title}</h2>
      {children}
    </section>
  );
}

export default async function DeveloperPage({ params }: Props) {
  const { slug } = await params;
  const d = getDeveloper(slug);
  if (!d) notFound();

  const showLegalName = Boolean(d.legalName) && d.legalName.toLowerCase() !== d.name.toLowerCase();

  // Key facts: anything we don't know yet is simply left out. The registration status is always known.
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
    { label: "Registration status", value: developerStatusLabels[d.status] },
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

      <Container className="pb-[90px] pt-8">
        <Breadcrumb items={[{ label: "Developers", href: "/developers/" }, { label: d.name }]} />

        <header className="relative mt-4 overflow-hidden rounded-[2px] bg-gradient-to-br from-ink via-[#141010] to-[#2b2222] px-6 py-10 md:px-12 md:py-14">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 right-2 select-none font-heading text-[120px] leading-none text-white/[0.07] md:text-[180px]"
          >
            {monogram(d.name)}
          </span>
          <div className="relative max-w-[760px]">
            <StatusPill status={d.status} className="!border-white/25 !bg-white/10 !text-white/85" />
            <h1 className="mt-4 font-heading text-[28px] font-normal leading-[1.15] tracking-[-0.01em] text-white sm:text-[34px] md:text-[44px]">
              {d.name}
            </h1>
            {d.tagline && <p className="mt-4 text-[15px] leading-[1.7] text-white/85 md:text-[17px]">{d.tagline}</p>}
            {showLegalName && <p className="mt-4 text-[12.5px] uppercase tracking-[0.08em] text-white/55">Registered as {d.legalName}</p>}
          </div>
        </header>

        {d.description.length > 0 && (
          <Section title={`About ${d.name}`}>
            <div className="max-w-[840px] space-y-4 text-[15px] leading-[1.85] text-body">
              {d.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Section>
        )}

        {facts.length > 0 && (
          <Section title="Key Facts">
            <dl className="grid gap-x-8 gap-y-6 border border-line bg-mist p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-4">
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
            <ul className="flex flex-wrap gap-2.5">
              {d.specialities.map((s) => (
                <li key={s} className="rounded-[2px] border border-line bg-white px-3.5 py-2 text-[13px] text-body">
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {d.projects.length > 0 && (
          <Section title="Signature Projects">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.projects.map((p) => (
                <li key={p.name} className="rounded-[2px] border border-line bg-white px-5 py-4">
                  <p className="text-[15px] font-medium leading-snug text-ink">{p.name}</p>
                  {p.community && <p className="mt-1 text-[13px] text-muted">{p.community}</p>}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {communities.length > 0 && (
          <Section title="Communities">
            <ul className="flex flex-wrap gap-2.5">
              {communities.map((c) =>
                c.href ? (
                  <li key={c.name}>
                    <Link
                      href={c.href}
                      className="inline-flex min-h-[44px] items-center rounded-[2px] border border-line bg-white px-4 text-[13.5px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                    >
                      {c.name}
                    </Link>
                  </li>
                ) : (
                  <li key={c.name} className="inline-flex min-h-[44px] items-center rounded-[2px] border border-line bg-mist px-4 text-[13.5px] text-body">
                    {c.name}
                  </li>
                ),
              )}
            </ul>
          </Section>
        )}

        {listings.length > 0 && (
          <Section title={`Available Properties${matched.length > listings.length ? ` (${listings.length} of ${matched.length})` : ""}`}>
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

        <Section title={`Enquire about ${d.name}`}>
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
            <div className="border border-line bg-white p-6 sm:p-8">
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
