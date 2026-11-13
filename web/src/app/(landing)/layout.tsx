import { Cairo, Mulish, Raleway } from "next/font/google";
import "@/components/landing/landing.css";

// Fonts used by the original Elementor landing pages (Mulish + Raleway, Cairo for Arabic)
const mulish = Mulish({ variable: "--font-mulish", subsets: ["latin"], weight: ["200", "300", "400", "500", "700", "800"] });
const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"], weight: ["300", "400"] });
// Cairo is only applied to Arabic text (`[lang="ar"]`), i.e. one of these pages, so it is not
// preloaded: otherwise every landing page preloads two Cairo files it never paints with
// ("resource was preloaded using link preload but not used within a few seconds").
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"], weight: ["300", "400", "700", "800"], preload: false });

// Standalone project landing pages ("Elementor canvas"): no site header or footer.
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <div className={`landing ${mulish.variable} ${raleway.variable} ${cairo.variable}`}>{children}</div>;
}
