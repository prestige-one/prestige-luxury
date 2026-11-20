import type { Metadata } from "next";
import { cleanElementorHtml } from "@/components/info/blocks";
import { Container, PageBanner, WpContent } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { site } from "@/lib/site";

const page = getPage("/privacy-policy/")!;
export const metadata: Metadata = seoMetadata(page);

const policyHtml = cleanElementorHtml(page.html)
  .replace("accessible from /,", `accessible from ${site.url},`)
  .replace(/\s*Our Privacy Policy was generated with the help of <a\b[^>]*>GDPR Privacy Policy Generator from GDPRPrivacyNotice\.com<\/a>\.?/i, "")
  .replace(/<p>For more general information on cookies, please read <a\b[^>]*>[\s\S]*?<\/a>\.<\/p>/i, "");

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageBanner path="/privacy-policy/" title="Privacy Policy" image="/wp-content/uploads/2020/02/bg-bw.jpg" />
      <section className="py-[70px] md:py-[90px]">
        <Container className="max-w-[900px]">
          <WpContent html={policyHtml} />
        </Container>
      </section>
    </>
  );
}
