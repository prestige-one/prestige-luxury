"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { GoogleReview } from "@/lib/google-reviews";

export default function GoogleReviewCard({ review, duplicate = false }: { review: GoogleReview; duplicate?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const quoteId = `pl-review-${useId()}`;

  return (
    <figure className="pl-review-card flex h-full min-h-[340px] flex-col rounded-xl border border-line bg-[#fbfbfb] p-6 md:p-7">
      <div role="img" aria-label={`${review.rating} out of 5 stars`} className="flex gap-1 text-[#e5ad00]">
        {Array.from({ length: review.rating }, (_, index) => (
          <svg key={index} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.76 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2Z" /></svg>
        ))}
      </div>
      <div className="mt-5 flex-1">
        <blockquote id={quoteId} className={`whitespace-pre-line text-[14px] leading-[1.8] text-body ${expanded ? "" : "line-clamp-6"}`}>“{review.text}”</blockquote>
        {review.text.length > 260 && (
          <button type="button" aria-expanded={expanded} aria-controls={quoteId} tabIndex={duplicate ? -1 : undefined}
            onClick={() => setExpanded(!expanded)} className="mt-2 cursor-pointer py-1 text-[12px] font-medium text-ink underline underline-offset-4 hover:opacity-60">
            {expanded ? "Show less" : "Read more"}<span className="sr-only">: {review.author}’s review</span>
          </button>
        )}
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
