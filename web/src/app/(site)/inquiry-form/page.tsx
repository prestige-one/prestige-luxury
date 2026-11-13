import type { Metadata } from "next";
import LeadForm, { type LeadField } from "@/components/LeadForm";
import { areaOptions, propertyTypeOptions } from "@/components/info/options";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = seoMetadata(getPage("/inquiry-form/")!);

const fields: LeadField[] = [
  {
    name: "enquiry_type",
    label: "Inquiry Type",
    type: "select",
    options: ["Purchase", "Rent", "Sell", "Evaluation", "Mortgage"],
    required: true,
    half: true,
  },
  { name: "user_type", label: "I'm a", type: "select", options: ["I'm a real estate agent", "I'm a property owner"], required: true, half: true },
  { name: "first_name", label: "First Name", required: true, half: true },
  { name: "last_name", label: "Last Name", half: true },
  { name: "email", label: "Email Address", type: "email", required: true, half: true },
  { name: "phone", label: "Mobile", type: "tel", required: true, half: true },
  { name: "area", label: "Select Area", type: "select", options: areaOptions, required: true, half: true },
  { name: "property_type", label: "Select type", type: "select", options: propertyTypeOptions, required: true, half: true },
  { name: "max_price", label: "Max price", required: true, half: true },
  { name: "min_size_sqft", label: "Minimum size (Sq Ft)", required: true, half: true },
  { name: "beds", label: "Number of beds", required: true, half: true },
  { name: "baths", label: "Number of baths", required: true, half: true },
  { name: "message", label: "Message", type: "textarea" },
];

export default function InquiryFormPage() {
  return (
    <section className="bg-mist py-16 md:py-[100px]">
      <Container className="max-w-[860px]">
        <div className="border border-line bg-white p-6 sm:p-10">
          <h1 className="text-[26px] font-semibold text-ink md:text-[30px]">Custom Inquiry Form</h1>
          <p className="mb-8 mt-3 text-[14.5px] leading-[1.7] text-muted">
            Tell us what you are looking for and one of our property experts will be in touch with you shortly.
          </p>
          <LeadForm form="Inquiry" fields={fields} redirectTo="/thank-you/" />
          <p className="mt-5 text-[12px] text-muted">By submitting this form you consent to having this website store your submitted information.</p>
        </div>
      </Container>
    </section>
  );
}
