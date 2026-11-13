import type { Metadata } from "next";
import { Button, Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata: Metadata = { ...seoMetadata(getPage("/thank-you/")!), robots: { index: false, follow: true } };

export default function ThankYouPage() {
  return (
    <section className="flex min-h-[60vh] items-center bg-cream py-16 md:py-[100px]">
      <Container className="max-w-[720px] text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="m4 12 5 5L20 6" />
          </svg>
        </span>
        <h1 className="mt-8 text-[34px] font-medium text-ink md:text-[42px]">Thank you</h1>
        <p className="mt-3 text-[17px] text-body">We&apos;ve received your message and we&apos;ll be in touch shortly.</p>
        <Button href="/" className="mt-10">
          Back to Home
        </Button>
      </Container>
    </section>
  );
}
