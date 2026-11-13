import type { Metadata } from "next";
import { cleanElementorHtml } from "@/components/info/blocks";
import { Container, PageBanner, WpContent } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

const page = getPage("/terms-and-conditions/")!;
export const metadata: Metadata = seoMetadata(page);

export default function TermsPage() {
  return (
    <>
      <PageBanner title="Terms and Conditions" image="/wp-content/uploads/2020/02/bg-bw.jpg" />
      <section className="py-[70px] md:py-[90px]">
        <Container className="max-w-[900px]">
          <WpContent html={cleanElementorHtml(page.html)} />
        </Container>
      </section>
    </>
  );
}
