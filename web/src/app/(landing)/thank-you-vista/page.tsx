import { DocCard, ThankYouPage } from "@/components/landing/ThankYou";
import { getPage, seoMetadata } from "@/lib/content";

export const metadata = seoMetadata(getPage("/thank-you-vista/")!);

const up = (f: string) => `/wp-content/uploads/2023/05/${f}`;

export default function ThankYouVistaPage() {
  return (
    <ThankYouPage>
      <div className="mx-auto grid max-w-[760px] gap-10 sm:grid-cols-2">
        <DocCard bordered image={{ src: up("thank-you-brochure.jpg"), width: 1000, height: 1000 }} href={up("newrenders_screen_VISTA_A4Portrait_DSC.pdf")} label="View Brochure" />
        <DocCard bordered image={{ src: up("thank-you-factsheet.jpg"), width: 1000, height: 1000 }} href={up("newrenders_A_VISTA_FactSheet_A4Portrait.pdf")} label="View Factsheet" />
      </div>
    </ThankYouPage>
  );
}
