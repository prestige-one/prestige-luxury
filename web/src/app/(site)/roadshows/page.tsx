import type { Metadata } from "next";
import ProjectEnquiryPage from "@/components/projects/ProjectEnquiryPage";

export const metadata: Metadata = {
  title: { absolute: "Dubai Property Roadshows | Prestige Luxury" },
  description: "Register your interest in upcoming Dubai property roadshows and project presentations with Prestige Luxury Real Estate.",
  alternates: { canonical: "/roadshows/" },
  openGraph: { title: "Dubai Property Roadshows | Prestige Luxury", url: "/roadshows/" },
};

export default function RoadshowsPage() {
  return <ProjectEnquiryPage title="Upcoming Roadshows"
    intro="Ask our team about upcoming off-plan presentations and property roadshows. Share your preferred city and the projects that interest you, and we’ll contact you when suitable sessions are confirmed."
    formTitle="Register your interest" topic="Off-plan roadshow enquiry" locationLabel="Preferred city" submitLabel="Register Interest" />;
}
