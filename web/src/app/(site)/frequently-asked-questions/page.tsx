import type { Metadata } from "next";
import { Accordion } from "@/components/info/blocks";
import { Button, Container, PageBanner } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { site } from "@/lib/site";
import faq from "../../../../content/faqs.json";

const page = getPage("/frequently-asked-questions/")!;
const baseMetadata = seoMetadata(page);
export const metadata: Metadata = {
  ...baseMetadata,
  title: { absolute: faq.seoTitle },
  description: faq.description,
  openGraph: { ...baseMetadata.openGraph, title: faq.seoTitle, description: faq.description },
  twitter: { ...baseMetadata.twitter, title: faq.seoTitle, description: faq.description },
};

const faqImage = "/images/faq-dubai-skyline-4k.webp";
const total = faq.groups.reduce((count, group) => count + group.items.length, 0);

// Match the structured data to the questions and answers actually rendered below.
const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${site.url}/frequently-asked-questions/#pl-faq`,
  mainEntity: faq.groups.flatMap((group) => group.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }))),
}).replace(/</g, "\\u003c");

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <PageBanner path="/frequently-asked-questions/" title={faq.title} subtitle={faq.intro} image={faqImage} imageQuality={85} imageClassName="opacity-90" />

      <section className="pl-faq-section bg-mist py-12 md:py-16">
        <Container className="grid items-start gap-10 lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-12">
          <nav aria-label="FAQ topics" className="pl-faq-topics lg:sticky lg:top-28">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Find your answer</p>
            <h2 className="mt-2 text-[23px] font-medium leading-tight tracking-[-0.02em] text-ink">Browse by topic</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">{total} answers to help you plan your next property move.</p>
            <ul className="mt-6 grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              {faq.groups.map((group) => (
                <li key={group.id}>
                  <a href={`#pl-faq-${group.id}`} className="pl-faq-topic group flex h-full min-h-[76px] items-center justify-between gap-3 rounded-[8px] border border-line bg-white px-4 py-4 text-[13px] font-medium leading-snug text-ink transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black max-[374px]:flex-col max-[374px]:items-start max-[374px]:gap-2 motion-reduce:transition-none">
                    <span>{group.label}</span>
                    <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-mist px-1 text-[11px] text-muted group-hover:bg-white/15 group-hover:text-white">{group.items.length}<span className="sr-only"> questions</span></span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 hidden border-t border-line pt-5 text-[13px] leading-relaxed lg:block">
              <p className="text-muted">Prefer to speak with our team?</p>
              <a href="/contact-us/" className="mt-2 inline-flex min-h-11 items-center gap-3 font-medium text-ink underline-offset-4 hover:underline">Contact Prestige Luxury <span aria-hidden="true">↗</span></a>
            </div>
          </nav>

          <div className="min-w-0 space-y-10 md:space-y-14">
            {faq.groups.map((group, index) => (
              <section key={group.id} id={`pl-faq-${group.id}`} aria-labelledby={`pl-faq-${group.id}-title`} className="pl-faq-group scroll-mt-4">
                <div className="mb-5 flex items-start gap-4">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-[12px] font-medium text-muted">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 id={`pl-faq-${group.id}-title`} className="text-[22px] font-medium leading-[1.3] tracking-[-0.02em] text-ink md:text-[25px]">{group.title}</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">{group.description}</p>
                  </div>
                </div>
                <Accordion items={group.items} defaultOpenFirst={index === 0} className="pl-faq-accordion overflow-hidden rounded-[10px] bg-white [&_summary]:min-h-[68px] [&_summary]:gap-5 [&_summary]:py-5 [&_summary]:text-[14px] [&_summary]:leading-relaxed [&_summary]:focus-visible:outline-2 [&_summary]:focus-visible:-outline-offset-4 [&_summary]:focus-visible:outline-black [&_summary]:sm:px-6 [&_.wp-content]:sm:px-6" />
              </section>
            ))}

            <aside aria-label="More help" className="pl-faq-help rounded-[10px] bg-black p-6 text-white sm:p-8">
              <h2 className="text-[23px] font-medium leading-tight tracking-[-0.02em]">Still have a question?</h2>
              <p className="mt-3 max-w-[540px] text-[14px] leading-relaxed text-white/80">Speak with our team for guidance specific to your property, plans and next steps in Dubai.</p>
              <Button href="/contact-us/" variant="light" className="mt-6">Contact our team</Button>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
