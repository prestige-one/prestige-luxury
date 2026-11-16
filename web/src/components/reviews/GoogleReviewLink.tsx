import { googleReviewsUrl } from "@/lib/google-reviews";

export default function GoogleReviewLink() {
  return (
    <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer"
      aria-label="Read our reviews on Google. Opens in a new tab."
      className="pl-google-review-link inline-flex min-h-14 items-center gap-3 rounded-full border border-black/15 bg-white px-5 py-2.5 text-black shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
      <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M43.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11c-.5 2.5-1.9 4.6-4.1 6v5.3h6.7c3.9-3.6 6-8.9 6-15.3Z" />
        <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.3c-1.8 1.2-4.1 1.9-6.8 1.9-5.3 0-9.8-3.6-11.4-8.4H5.7v5.4A20.4 20.4 0 0 0 24 44Z" />
        <path fill="#FBBC05" d="M12.6 27.3a12 12 0 0 1 0-6.6v-5.4H5.7a20 20 0 0 0 0 17.4l6.9-5.4Z" />
        <path fill="#EA4335" d="M24 12.3c3 0 5.6 1 7.7 3l5.8-5.8A19.4 19.4 0 0 0 24 4 20.4 20.4 0 0 0 5.7 15.3l6.9 5.4c1.6-4.8 6.1-8.4 11.4-8.4Z" />
      </svg>
      <span className="text-[14px] font-medium">Read our Google reviews</span>
      <span aria-hidden="true" className="ml-1 text-[18px]">↗</span>
    </a>
  );
}
