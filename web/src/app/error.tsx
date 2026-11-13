"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-mist px-5 py-20 text-center">
      <div className="max-w-[520px]">
        <h1 className="font-heading text-[26px] text-ink md:text-[32px]">Something went wrong</h1>
        <p className="mt-3 text-[15px] text-muted">
          Sorry — this page could not be displayed. Please try again, or contact us on{" "}
          <a href="tel:+97144468302" className="underline underline-offset-4 hover:text-accent">
            +971 (0) 4 446 8302
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center rounded-[2px] bg-black px-6 text-[14px] font-medium text-white transition-colors hover:bg-accent"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-[2px] border border-ink px-6 text-[14px] font-medium text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
