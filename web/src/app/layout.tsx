import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import FloatingContact from "@/components/FloatingContact";
import CookiePreferences from "@/components/cookies/CookiePreferences";
import CurrencyProvider from "@/components/currency/CurrencyProvider";
import { site } from "@/lib/site";
import { defaultSocialImage } from "@/lib/seo";
import { BusinessStructuredData } from "@/components/StructuredData";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} • ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  // No `icons` entry: `app/favicon.ico` and `app/icon.png` (both the agency's own mark, taken
  // from the live site) are picked up by Next's file convention, which also fingerprints them.
  openGraph: { siteName: site.name, locale: "en_US", type: "website", images: [{ url: defaultSocialImage, width: 1200, height: 630, alt: site.name }] },
  twitter: { card: "summary_large_image", images: [defaultSocialImage] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={poppins.variable}>
      <body className="min-h-screen antialiased">
        <BusinessStructuredData />
        {/* Restores the saved currency and fetches rates once, rather than from whichever
            price on the page happens to hydrate first. Renders no markup of its own. */}
        <CurrencyProvider>{children}</CurrencyProvider>
        <FloatingContact />
        <CookiePreferences />
      </body>
    </html>
  );
}
