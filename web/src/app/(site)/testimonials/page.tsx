import type { Metadata } from "next";
import { CtaBanner } from "@/components/info/blocks";
import GoogleReviewCard from "@/components/reviews/GoogleReviewCard";
import GoogleReviewLink from "@/components/reviews/GoogleReviewLink";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { featurePhoto } from "@/lib/imagery";
import { googleReviews, googleReviewSummary } from "@/lib/google-reviews";

export const metadata: Metadata = seoMetadata(getPage("/testimonials/")!);

const ctaImage = featurePhoto("Testimonials call to action", "full") ?? "/wp-content/uploads/2021/04/aerial-view-of-dubai-palm-jumeirah-island-1170x785.jpg";

export default function TestimonialsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-black py-16 text-center text-white md:py-20">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-[64px] font-black uppercase leading-none tracking-[6px] text-white/5 md:text-[140px] md:tracking-[20px]"
        >
          Reviews
        </p>
        <h1 className="relative text-[30px] font-medium tracking-[0.02em] text-white md:text-[42px]">Testimonials</h1>
      </section>

      <section aria-labelledby="pl-testimonials-heading" className="pl-testimonials-grid bg-white py-14 md:py-20">
        <Container>
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Real experiences. Lasting relationships.</p>
          <h2 id="pl-testimonials-heading" className="mb-3 text-center font-heading text-ink text-section">What our clients say</h2>
          <p className="mx-auto mb-10 max-w-[560px] text-center text-[15px] leading-[1.7] text-muted">
            Buyers, sellers, landlords and tenants on working with our sales and property management teams.
          </p>
          <ul aria-label="Selected Google reviews" className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
            {googleReviews.map((review) => (
              <li key={review.id} className="h-full">
                <GoogleReviewCard review={review} />
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col items-center gap-3 border-t border-line pt-10 text-center">
            <p className="text-[15px] text-ink">More experiences, in our clients’ own words.</p>
            <GoogleReviewLink />
            <p className="text-[11px] text-muted">Selected reviews shown above. Overall Google rating checked on <time dateTime={googleReviewSummary.verifiedAt}>16 November 2026</time>.</p>
          </div>
        </Container>
      </section>

      <CtaBanner
        image={ctaImage}
        title="Thinking of buying, selling or letting in Dubai?"
        lines={["Speak to an advisor who works your community every day."]}
        cta={{ label: "Speak to an Advisor", href: "/contact-us/" }}
      />
    </>
  );
}
