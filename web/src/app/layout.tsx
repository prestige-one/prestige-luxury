import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import FloatingContact from "@/components/FloatingContact";
import CurrencyProvider from "@/components/currency/CurrencyProvider";
import { site } from "@/lib/site";
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
  openGraph: { siteName: site.name, locale: "en_US", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen antialiased">
        {/* Restores the saved currency and fetches rates once, rather than from whichever
            price on the page happens to hydrate first. Renders no markup of its own. */}
        <CurrencyProvider>{children}</CurrencyProvider>
        <FloatingContact />
      </body>
    </html>
  );
}
