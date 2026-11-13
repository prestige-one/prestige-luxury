import Footer from "@/components/Footer";
import Header from "@/components/Header";

// Pages with the normal header + footer. Standalone project landing pages live in (landing).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
