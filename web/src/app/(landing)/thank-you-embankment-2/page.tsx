import { EmbankmentTours, ThankYouPage } from "@/components/landing/ThankYou";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata = seoMetadata(getPage("/thank-you-embankment-2/")!);

export default function ThankYouEmbankment2Page() {
  return (
    <ThankYouPage>
      <EmbankmentTours />
    </ThankYouPage>
  );
}
