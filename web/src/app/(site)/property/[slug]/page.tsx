import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import PropertyCard from "@/components/listings/PropertyCard";
import PropertyGallery from "@/components/listings/PropertyGallery";
import { TrackView } from "@/components/listings/RecentlyViewed";
import { AreaIcon, BathIcon, BedIcon, CheckIcon, HomeIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/listings/icons";
import { Breadcrumb, Container } from "@/components/ui";
import { addressLine, bedsLabel, isUnoptimized, paragraphs, propertyStatus, sqft } from "@/lib/listing-format";
import { similarListings } from "@/lib/listing-views";
import { formatPrice, getProperty, properties, type Property } from "@/lib/properties";
import { site } from "@/lib/site";

// Only listings present in content/properties.json exist; anything else is a 404.
// With an empty dataset this returns [] and the build simply prerenders no property pages.
export const dynamicParams = false;
export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const excerpt = (text: string, max = 158) => {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : t;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) return {};
  const title = `${p.title} | ${site.name}`;
  const description = excerpt(p.description) || `${p.type} ${propertyStatus(p).label.toLowerCase()} in ${p.community}, ${p.city}.`;
  const path = `/property/${p.slug}/`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: p.images[0] ? [p.images[0]] : undefined },
  };
}

const enquiryFields: LeadField[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "message", label: "Message", type: "textarea" },
];

/** "+971(0) 50 123 4567" / "050 123 4567" → "971501234567" for wa.me links */
function waNumber(phone: string) {
  let d = phone.replace(/\(0\)/g, "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = `971${d.slice(1)}`;
  return d;
}

const absolute = (src: string) => (/^https?:/i.test(src) ? src : `${site.url}${src}`);

function jsonLd(p: Property) {
  const url = `${site.url}/property/${p.slug}/`;
  const residenceType = /villa|townhouse/i.test(p.type) ? "SingleFamilyResidence" : /apartment|studio|penthouse/i.test(p.type) ? "Apartment" : "Place";
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: excerpt(p.description, 500),
    url,
    image: p.images.map(absolute),
    datePosted: p.listedAt,
    dateModified: p.updatedAt,
    identifier: p.reference,
    about: {
      "@type": residenceType,
      name: p.title,
      ...(residenceType !== "Place" && {
        numberOfRooms: p.bedrooms ?? undefined,
        numberOfBathroomsTotal: p.bathrooms ?? undefined,
        floorSize: p.sizeSqft ? { "@type": "QuantitativeValue", value: p.sizeSqft, unitCode: "FTK" } : undefined,
      }),
      address: {
        "@type": "PostalAddress",
        streetAddress: p.location[0],
        addressLocality: p.community,
        addressRegion: p.city,
        addressCountry: "AE",
      },
      geo: p.coordinates ? { "@type": "GeoCoordinates", latitude: p.coordinates.lat, longitude: p.coordinates.lng } : undefined,
    },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      businessFunction: p.purpose === "rent" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
      url,
      seller: { "@type": "RealEstateAgent", name: site.name, telephone: site.phone, url: site.url },
    },
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-white p-6 md:p-8">
      <h2 className="mb-5 border-b border-line pb-3 text-[18px] font-medium text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) notFound();

  const status = propertyStatus(p);
  const beds = bedsLabel(p.bedrooms);
  const similar = similarListings(p, 3);
  const agentName = p.agent?.name || site.name;
  const phone = p.agent?.phone || site.phone;
  const tel = p.agent?.phone ? `tel:${p.agent.phone.replace(/\(0\)/g, "").replace(/[^\d+]/g, "")}` : site.phoneHref;
  const whatsapp = `https://wa.me/${waNumber(p.agent?.phone || site.phoneHref)}?text=${encodeURIComponent(
    `Hello, I'm interested in "${p.title}" (Ref: ${p.reference}) — ${site.url}/property/${p.slug}/`,
  )}`;

  const facts: [string, string | null | undefined][] = [
    ["Reference", p.reference],
    ["Price", formatPrice(p)],
    ["Property Type", p.type],
    ["Purpose", p.purpose === "rent" ? "For Rent" : "For Sale"],
    ["Bedrooms", p.bedrooms === null ? null : p.bedrooms === 0 ? "Studio" : String(p.bedrooms)],
    ["Bathrooms", p.bathrooms === null ? null : String(p.bathrooms)],
    ["Property Size", p.sizeSqft ? sqft(p.sizeSqft) : null],
    ["Completion", p.completion === "off-plan" ? "Off-Plan" : "Ready"],
    ["Furnishing", p.furnished === true ? "Furnished" : p.furnished === false ? "Unfurnished" : null],
    ["Permit Number", p.permitNumber],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(p) }} />
      <TrackView item={{ slug: p.slug, title: p.title, price: formatPrice(p), image: p.images[0] }} />

      <Container className="pb-[90px] pt-8">
        <Breadcrumb items={[{ label: status.label, href: `/status/${status.slug}/` }, { label: p.title }]} />

        <div className="mt-4 mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-wide">
              <Link href={`/status/${status.slug}/`} className="rounded-[2px] bg-black px-2.5 py-1 text-white hover:bg-accent">
                {status.label}
              </Link>
              <span className="rounded-[2px] bg-smoke px-2.5 py-1 text-body">{p.type}</span>
            </div>
            <h1 className="text-[26px] font-medium leading-tight text-ink md:text-[32px]">{p.title}</h1>
            <p className="mt-2 flex items-start gap-1.5 text-[14px] text-muted">
              <PinIcon className="mt-[4px] shrink-0" />
              {addressLine(p)}
            </p>
          </div>
          <p className="shrink-0 text-[26px] font-semibold text-ink md:text-right md:text-[30px]">{formatPrice(p)}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0 space-y-8">
            <PropertyGallery images={p.images} title={p.title} />

            <Section title="Overview">
              <ul className="grid grid-cols-2 gap-5 text-[14px] sm:grid-cols-4">
                <Fact icon={<HomeIcon size={22} />} label="Type" value={p.type} />
                {beds && <Fact icon={<BedIcon size={22} />} label="Bedrooms" value={beds} />}
                {p.bathrooms !== null && <Fact icon={<BathIcon size={22} />} label="Bathrooms" value={String(p.bathrooms)} />}
                {p.sizeSqft !== null && <Fact icon={<AreaIcon size={22} />} label="Size" value={sqft(p.sizeSqft)} />}
              </ul>
            </Section>

            {p.description && (
              <Section title="Description">
                <div className="space-y-4 text-[15px] leading-[1.8] text-body">
                  {paragraphs(p.description).map((t, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {t}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Details">
              <dl className="grid gap-x-10 text-[14px] sm:grid-cols-2">
                {facts
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-line py-2.5">
                      <dt className="font-medium text-ink">{k}</dt>
                      <dd className="text-right text-body">{v}</dd>
                    </div>
                  ))}
              </dl>
            </Section>

            {p.amenities.length > 0 && (
              <Section title="Features & Amenities">
                <ul className="grid gap-x-6 gap-y-3 text-[14px] text-body sm:grid-cols-2 md:grid-cols-3">
                  {p.amenities.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <CheckIcon className="mt-[3px] shrink-0 text-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {p.coordinates && (
              <Section title="Map">
                <div className="relative aspect-[16/9] overflow-hidden bg-smoke">
                  <iframe
                    src={`https://www.google.com/maps?q=${p.coordinates.lat},${p.coordinates.lng}&z=15&output=embed`}
                    title={`Map of ${p.title}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </Section>
            )}
          </div>

          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <div className="border border-line bg-white p-6">
              <div className="flex items-center gap-4">
                <span className="relative flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-smoke text-[22px] font-medium text-ink">
                  {p.agent?.photo ? (
                    <Image src={p.agent.photo} alt={agentName} fill sizes="70px" unoptimized={isUnoptimized(p.agent.photo)} className="object-cover object-top" />
                  ) : (
                    agentName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[16px] font-medium text-ink">{agentName}</p>
                  <p className="text-[13px] text-muted">{p.agent ? "Property Consultant" : site.tagline}</p>
                  <a href={tel} className="mt-0.5 block text-[13px] text-body hover:text-accent">
                    {phone}
                  </a>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <a
                  href={tel}
                  className="flex items-center justify-center gap-2 bg-black px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-accent"
                >
                  <PhoneIcon /> Call
                </a>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-ink px-4 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <WhatsAppIcon /> WhatsApp
                </a>
              </div>
              <div className="mt-6 border-t border-line pt-6">
                <h2 className="mb-4 text-[16px] font-medium text-ink">Enquire about this property</h2>
                <LeadForm
                  form="Property enquiry"
                  fields={enquiryFields}
                  submitLabel="Send Message"
                  extra={{ property: p.reference, url: p.sourceUrl }}
                />
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-[24px] font-medium text-ink">Similar Listings</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <PropertyCard key={s.id} property={s} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="text-muted">{icon}</span>
      <span>
        <span className="block text-[12px] text-muted">{label}</span>
        <span className="block font-medium text-ink">{value}</span>
      </span>
    </li>
  );
}
