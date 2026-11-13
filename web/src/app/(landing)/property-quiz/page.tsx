import Script from "next/script";
import { getPage, seoMetadata } from "@/lib/content";

// Nothing here is indexable text (a third-party quiz iframe / an office display board),
// so the page is kept out of search results.
export const metadata = { ...seoMetadata(getPage("/property-quiz/")!), robots: { index: false, follow: true } };

// The quiz itself is hosted on involve.me (project "prestige-real-estate"); this page only embeds it full-screen.
export default function PropertyQuizPage() {
  return (
    <main className="min-h-screen pt-[100px]">
      <div className="involveme_embed" data-project="prestige-real-estate" data-embed-mode="fullscreen" data-noresize="true" />
      <Script src="https://digitalorks.involve.me/embed" strategy="afterInteractive" />
    </main>
  );
}
