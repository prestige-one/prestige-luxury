import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
import CurrencyProvider from "@/components/currency/CurrencyProvider";
import { site } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} • ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: { icon: "/favicon.ico" },
  openGraph: { siteName: site.name, locale: "en_US", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="min-h-screen antialiased">
        {/* Restores the saved currency and fetches rates once, rather than from whichever
            price on the page happens to hydrate first. Renders no markup of its own. */}
        <CurrencyProvider>{children}</CurrencyProvider>
        {/* Floating WhatsApp contact button — every page, site and landing alike. */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
