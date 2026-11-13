import { EmbankmentTours, ThankYouPage } from "@/components/landing/ThankYou";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata = seoMetadata(getPage("/thank-you-embankment/")!);

export default function ThankYouEmbankmentPage() {
  return (
    <ThankYouPage>
      <EmbankmentTours />
    </ThankYouPage>
  );
}
