import { Accordion, CheckList, CtaBanner } from "@/components/info/blocks";
import { Breadcrumb, Button, Container, PageBanner } from "@/components/ui";
import { isPagePublished } from "@/lib/site";

/**
 * Layout shared by the Buyer's and Tenant's guides, so the two read as a pair: banner, an intro
 * beside a short "at a glance" card, numbered steps, a costs table, a checklist, questions, and
 * a call to action. Each page supplies only its words.
 *
 * Figures in these guides are set by the Dubai Land Department, RERA, DEWA and the banks, and
 * they change. Every guide therefore states the month its figures were checked and names the
 * official place to confirm them — the costs table is a budgeting aid, not a quotation.
 */
export type GuideCost = { item: string; amount: string; note?: string };

export type Guide = {
  title: string;
  subtitle: string;
  image: string;
  crumb: string;
  intro: string[];
  glance: { label: string; value: string }[];
  stepsTitle: string;
  steps: { title: string; text: string }[];
  costsTitle: string;
  costsIntro: string;
  costs: GuideCost[];
  checkedAt: string;
  confirmWith: string;
  checklistTitle: string;
  checklist: string[];
  faqs: { q: string; a: string }[];
  cta: { title: string; lines: string[]; label: string; href: string; image: string };
  related: { label: string; href: string }[];
};

export default function GuidePage({ g }: { g: Guide }) {
  return (
    <>
      <PageBanner title={g.title} subtitle={g.subtitle} image={g.image} />

      <section className="py-14 md:py-[80px]">
        <Container>
          <Breadcrumb items={[{ label: g.crumb }]} />

          {/* Intro + at a glance */}
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
            <div className="space-y-5 text-[15px] font-light leading-[1.9] text-body">
              {g.intro.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <aside className="self-start rounded-[4px] border border-line bg-mist p-7 lg:sticky lg:top-[100px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/50">At a glance</p>
              <dl className="mt-4 divide-y divide-line">
                {g.glance.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-[14px] text-body">{row.label}</dt>
                    <dd className="text-right text-[14px] font-medium text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <Button href="/contact-us/" className="mt-6 w-full">
                Speak to a Property Specialist
              </Button>
            </aside>
          </div>
        </Container>
      </section>

      {/* Steps */}
      <section className="border-y border-line bg-mist py-14 md:py-[80px]">
        <Container>
          <h2 className="text-center text-[28px] font-medium text-ink md:text-[34px]">{g.stepsTitle}</h2>
          <ol className="mx-auto mt-10 max-w-[860px] space-y-4">
            {g.steps.map((s, i) => (
              <li key={s.title} className="flex gap-5 rounded-[4px] border border-line bg-white p-6 md:gap-7 md:p-7">
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black text-[15px] font-medium text-white"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[18px] font-medium text-ink">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] font-light leading-[1.8] text-body">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Costs */}
      <section className="py-14 md:py-[80px]">
        <Container>
          <div className="mx-auto max-w-[860px]">
            <h2 className="text-[28px] font-medium text-ink md:text-[34px]">{g.costsTitle}</h2>
            <p className="mt-3 text-[15px] font-light leading-[1.8] text-body">{g.costsIntro}</p>
            <div className="mt-8 overflow-hidden rounded-[4px] border border-line">
              <table className="w-full border-collapse text-left text-[14px]">
                <thead className="bg-black text-white">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-medium">Cost</th>
                    <th scope="col" className="px-5 py-3.5 font-medium">Typical amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {g.costs.map((c) => (
                    <tr key={c.item} className="align-top odd:bg-white even:bg-mist">
                      <th scope="row" className="px-5 py-4 font-medium text-ink">
                        {c.item}
                        {c.note && <span className="mt-1 block text-[13px] font-light leading-[1.6] text-muted">{c.note}</span>}
                      </th>
                      <td className="px-5 py-4 text-body">{c.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] leading-[1.7] text-muted">
              Figures checked {g.checkedAt}. Government and bank fees change from time to time — confirm the current amounts with{" "}
              {g.confirmWith} before you budget on them. VAT is charged at 5% where shown.
            </p>
          </div>
        </Container>
      </section>

      {/* Checklist */}
      <section className="bg-black py-14 text-white md:py-[80px]">
        <Container>
          <div className="mx-auto max-w-[860px]">
            <h2 className="text-[28px] font-medium md:text-[34px]">{g.checklistTitle}</h2>
            <CheckList items={g.checklist} dark className="mt-8 text-white/85 md:columns-2 md:gap-10 [&>li]:break-inside-avoid [&>li]:mb-3" />
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section className="py-14 md:py-[80px]">
        <Container>
          <div className="mx-auto max-w-[860px]">
            <h2 className="text-[28px] font-medium text-ink md:text-[34px]">Common questions</h2>
            <div className="mt-8">
              <Accordion items={g.faqs} />
            </div>
            <p className="mt-8 text-[14px] text-body">
              Keep reading:{" "}
              {g.related.filter((r) => isPagePublished(r.href)).map((r, i) => (
                <span key={r.href}>
                  {i > 0 && " · "}
                  <a href={r.href} className="underline underline-offset-4 hover:text-ink">
                    {r.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </Container>
      </section>

      <CtaBanner image={g.cta.image} title={g.cta.title} lines={g.cta.lines} cta={{ label: g.cta.label, href: g.cta.href }} />
    </>
  );
}
