import type { Metadata } from "next";
import SalesExpertsCta from "@/components/SalesExpertsCta";
import GoogleReviewCard from "@/components/reviews/GoogleReviewCard";
import GoogleReviewLink from "@/components/reviews/GoogleReviewLink";
import { Container } from "@/components/ui";
import { getPage, seoMetadata } from "@/lib/content";
import { googleReviews } from "@/lib/google-reviews";

export const metadata: Metadata = seoMetadata(getPage("/testimonials/")!);

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
        </Container>
      </section>

      <section aria-labelledby="pl-google-reviews-cta-title" className="pl-google-reviews-cta flex min-h-[260px] items-center justify-center border-y border-line bg-smoke py-12 text-center md:min-h-[280px]">
        <Container className="flex flex-col items-center justify-center gap-5">
          <h2 id="pl-google-reviews-cta-title" className="max-w-[600px] text-[22px] font-medium leading-snug text-ink md:text-[26px]">More experiences, in our clients’ own words.</h2>
          <GoogleReviewLink />
        </Container>
      </section>

      <SalesExpertsCta />
    </>
  );
}
