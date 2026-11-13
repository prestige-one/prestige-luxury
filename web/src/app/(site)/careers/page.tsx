import type { Metadata } from "next";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import { CheckList, CtaBanner } from "@/components/info/blocks";
import { Container, PageBanner } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = seoMetadata(getPage("/careers/")!);

const advantages = [
  "50–70% Commission",
  "Visa & Medical Insurance",
  "Dedicated Relocation Advisor.",
  "Professional Training Academy",
  "Exclusive Incentives",
  "Career Progression",
];

const fields: LeadField[] = [
  { name: "name", label: "Full Name", required: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "phone", label: "Mobile Number", type: "tel", required: true, half: true },
  { name: "position", label: "Position you are applying for" },
  { name: "message", label: "Cover Letter", type: "textarea" },
];

export default function CareersPage() {
  return (
    <>
      <PageBanner title="Careers" />

      <section className="py-16 md:py-[100px]">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-[25px] font-semibold leading-snug text-ink">Your Ambition Deserves the Right Address.</h2>
            <h3 className="mt-3 text-[17px] leading-[22px] text-body">
              Build your career. Expand your potential. Make your mark in Dubai real estate.
            </h3>
            <div className="mt-6 space-y-4 text-[14px] leading-[1.8] text-body">
              <p>
                At Prestige Luxury Real Estate, we believe exceptional careers are built by people who see opportunity, take initiative and
                strive for excellence.
              </p>
              <p>
                As an established real estate agency in Dubai, we bring together ambitious professionals, market expertise and a shared
                commitment to delivering exceptional client experiences.
              </p>
            </div>
            <h3 className="mt-8 text-[19px] font-semibold leading-[22px] text-ink">The Prestige Luxury Advantages</h3>
            <CheckList items={advantages} className="mt-5" />
          </div>

          <div id="apply" className="scroll-mt-28 border border-line bg-white p-6 shadow-[0_0_30px_rgba(0,0,0,0.06)] sm:p-10">
            <h2 className="mb-6 text-[22px] font-semibold uppercase tracking-wide text-ink">Apply Now</h2>
            <LeadForm form="Careers" fields={fields} submitLabel="Send" />
            <p className="mt-6 border-t border-line pt-5 text-[13px] leading-[1.7] text-muted">
              To complete your application, please email your CV to{" "}
              <a href={`mailto:${site.email}?subject=CV%20-%20Careers%20application`} className="font-medium text-ink underline underline-offset-2 hover:text-accent">
                {site.email}
              </a>{" "}
              with your name in the subject line.
            </p>
          </div>
        </Container>
      </section>

      <CtaBanner
        image="/wp-content/uploads/2026/11/dubai-skyline-view.webp"
        title="Have the Drive to Succeed?"
        lines={[
          "We're looking for ambitious, business-minded individuals with a passion for sales and the determination to excel in Dubai's real estate market.",
          "Your next big move starts here.",
        ]}
        cta={{ label: "Explore Openings", href: "#apply" }}
      />
    </>
  );
}
