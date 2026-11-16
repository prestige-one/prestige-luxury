import Link from "next/link";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import Media from "@/components/Media";
import { Container } from "@/components/ui";

/** Shared interest page for project services that do not have a dated event or live inventory feed. */
export default function ProjectEnquiryPage({ title, intro, formTitle, topic, locationLabel, submitLabel }: {
  title: string;
  intro: string;
  formTitle: string;
  topic: string;
  locationLabel: string;
  submitLabel: string;
}) {
  const fields: LeadField[] = [
    { name: "name", label: "Name", required: true, half: true },
    { name: "email", label: "Email", type: "email", required: true, half: true },
    { name: "phone", label: "Phone", type: "tel", required: true, half: true },
    { name: "preferred_location", label: locationLabel, half: true },
    { name: "message", label: "Tell us what you are looking for", type: "textarea" },
  ];

  return <section className="pl-project-enquiry bg-mist py-14 md:py-20">
    <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">The next chapter in Dubai</p>
        <h1 className="mt-3 text-[30px] font-medium leading-[1.2] tracking-[-0.025em] text-ink md:text-[38px]">{title}</h1>
        <p className="mt-5 text-[15px] leading-[1.85] text-body">{intro}</p>
        <Link href="/status/off-plan/" className="mt-5 inline-flex min-h-11 items-center gap-3 text-[13px] font-medium text-ink underline underline-offset-4 hover:opacity-65">Explore all off-plan projects <span aria-hidden="true">↗</span></Link>
        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-xl">
          <Media src="/images/blog/dubai-marina-apartments-1024x576-4f90fc1d9c.webp" alt="Dubai Marina skyline photographed at dusk" fill loading="eager" sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
        <h2 className="mb-6 text-[22px] font-medium leading-snug text-ink">{formTitle}</h2>
        <LeadForm form={topic} fields={fields} submitLabel={submitLabel} extra={{ enquiry_topic: topic }} redirectTo="/thank-you/" showLabels />
        <p className="mt-5 text-[11px] leading-[1.7] text-muted">By submitting this enquiry, you agree to be contacted by Prestige Luxury Real Estate about your request.</p>
      </div>
    </Container>
  </section>;
}
