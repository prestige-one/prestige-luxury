import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const suggestions = [
  { label: "Properties for sale", href: "/status/for-sale/" },
  { label: "Properties for rent", href: "/status/for-rent/" },
  { label: "Off-plan projects", href: "/status/off-plan/" },
  { label: "Our story", href: "/about/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact us", href: "/contact-us/" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-mist py-20 md:py-28">
          <Container className="max-w-[720px] text-center">
            <p className="font-heading text-[64px] leading-none text-line md:text-[90px]">404</p>
            <h1 className="mt-4 font-heading text-[26px] text-ink md:text-[34px]">This page could not be found</h1>
            <p className="mx-auto mt-3 max-w-[460px] text-[15px] text-muted">
              The page you are looking for may have been moved or no longer exists. Here are some places to continue from.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/">Back to home</Button>
              <Button href="/contact-us/" variant="outline">
                Speak to an advisor
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px]">
              {suggestions.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-body underline underline-offset-4 transition-colors hover:text-accent">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
