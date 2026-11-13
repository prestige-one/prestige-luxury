import { DocCard, ThankYouPage } from "@/components/landing/ThankYou";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata = seoMetadata(getPage("/thank-you-the-residence/")!);

const up = (f: string) => `/wp-content/uploads/2023/05/${f}`;

export default function ThankYouTheResidencePage() {
  return (
    <ThankYouPage>
      <div className="mx-auto grid max-w-[760px] gap-10 sm:grid-cols-2">
        <DocCard bordered image={{ src: up("thank-you-brochure-1.jpg"), width: 1000, height: 1000 }} href={up("v2_screen_Brochure_P1_RESIDENCE_A4lndscp_JVC.pdf")} label="View Brochure" />
        <DocCard bordered image={{ src: up("thank-you-factsheet-1.jpg"), width: 1000, height: 1000 }} href={up("A_FactSheet_P1_RESIDENCE_A4portrait_JVC.pdf")} label="View Factsheet" />
      </div>
    </ThankYouPage>
  );
}
