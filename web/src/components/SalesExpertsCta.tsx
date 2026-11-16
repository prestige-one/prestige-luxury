import Media from "@/components/Media";
import { Button } from "@/components/ui";

/** Shared sales enquiry CTA; omit the image for the plain black version. */
export default function SalesExpertsCta({ image }: { image?: string }) {
  return (
    <section className="pl-sales-experts-cta relative flex min-h-[360px] items-center justify-center overflow-hidden bg-black py-16 text-center md:min-h-[414px]">
      {image && <>
        <Media src={image} alt="Dubai waterfront terrace and skyline at blue hour" fill tone="ink" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
      </>}
      <div className="relative z-10 max-w-[600px] px-5">
        <h2 className="font-medium capitalize leading-[1.25] tracking-[-0.01em] text-white text-section">Connect with our sales experts</h2>
        <p className="mt-3 text-[15px] capitalize leading-[1.6] text-white/90 md:text-[17px]">Connect with our property specialists to discover the right real estate opportunity in Dubai.</p>
        <Button href="/contact-us/" variant="light" className="mt-6">Speak to a Property Specialist</Button>
      </div>
    </section>
  );
}
