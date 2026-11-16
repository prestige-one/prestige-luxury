import Image from "next/image";
import type { GoogleReview } from "@/lib/google-reviews";

export default function GoogleReviewCard({ review, duplicate = false }: { review: GoogleReview; duplicate?: boolean }) {
  const quoteId = `pl-review-${review.id}${duplicate ? "-copy" : ""}`;
  const expandable = review.text.length > 260;
  const excerpt = expandable ? `${review.text.slice(0, 240).replace(/\s+\S*$/, "")}…` : review.text;

  return (
    <figure data-pl-review={review.id} className="pl-review-card flex h-[400px] flex-col rounded-xl border border-line bg-[#fbfbfb] p-6 md:p-7">
      <div role="img" aria-label={`${review.rating} out of 5 stars`} className="flex gap-1 text-[#e5ad00]">
        {Array.from({ length: review.rating }, (_, index) => (
          <svg key={index} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.76 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2Z" /></svg>
        ))}
      </div>
      <div className="pl-review-copy relative mt-5 min-h-0 flex-1">
        {expandable && (
          // The browser can toggle this native control before React finishes hydrating.
          <details suppressHydrationWarning className="pl-review-disclosure h-full">
            <summary aria-controls={quoteId} tabIndex={duplicate ? -1 : undefined}
              className="absolute bottom-0 left-0 cursor-pointer list-none py-1 text-[12px] font-medium text-ink underline underline-offset-4 hover:opacity-60">
              <span className="pl-review-more">Read more</span><span className="pl-review-less">Show less</span><span className="sr-only">: {review.author}’s review</span>
            </summary>
            <blockquote id={quoteId} tabIndex={duplicate ? -1 : 0} aria-label={`${review.author}’s full review. Scroll to read.`}
              className="pl-review-full absolute inset-x-0 bottom-9 top-0 overflow-y-auto overscroll-contain whitespace-pre-line pr-3 text-[14px] leading-[1.8] text-body [scrollbar-width:thin]">“{review.text}”</blockquote>
          </details>
        )}
        <blockquote className="pl-review-excerpt absolute inset-x-0 top-0 line-clamp-6 whitespace-pre-line text-[14px] leading-[1.8] text-body">“{excerpt}”</blockquote>
      </div>
      <figcaption className="mt-6 border-t border-black/10 pt-5">
        <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined}
          aria-label={`Read ${review.author}’s review on Google`} className="group inline-flex min-h-12 items-center gap-3">
          <Image src={`/images/reviews/${review.id}.webp`} alt="" width={44} height={44} className="size-11 shrink-0 rounded-full object-cover" />
          <span><span className="block text-[14px] font-medium text-ink underline-offset-4 group-hover:underline">{review.author}</span><span className="mt-1 block text-[12px] text-muted">Google review <span aria-hidden="true">↗</span></span></span>
        </a>
      </figcaption>
    </figure>
  );
}
