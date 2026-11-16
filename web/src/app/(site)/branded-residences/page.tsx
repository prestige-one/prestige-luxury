import type { Metadata } from "next";
import ProjectEnquiryPage from "@/components/projects/ProjectEnquiryPage";

export const metadata: Metadata = {
  title: { absolute: "Branded Residences in Dubai | Prestige Luxury" },
  description: "Explore branded residences in Dubai with Prestige Luxury. Speak to our property specialists about your preferred location, home and current project availability.",
  alternates: { canonical: "/branded-residences/" },
  openGraph: { title: "Branded Residences in Dubai | Prestige Luxury", url: "/branded-residences/" },
};

export default function BrandedResidencesPage() {
  return <ProjectEnquiryPage title="Branded Residences in Dubai"
    intro="Explore brand-led residential concepts across Dubai with support from our property specialists. Tell us your preferred area, home type and budget, and our team can help you explore suitable projects and current availability."
    formTitle="Find your next address" topic="Branded residences enquiry" locationLabel="Preferred area" submitLabel="Enquire About Residences" />;
}
