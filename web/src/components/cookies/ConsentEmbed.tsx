"use client";

import type { IframeHTMLAttributes } from "react";
import { openCookieSettings, useCookieChoices } from "./preferences";

/** No iframe or third-party request exists until the visitor allows external content. */
export default function ConsentEmbed({ title, className = "", ...props }: IframeHTMLAttributes<HTMLIFrameElement>) {
  const choices = useCookieChoices();
  if (choices.externalContent) return <iframe {...props} title={title} className={className} />;
  return <div className={`pl-consent-embed flex items-center justify-center bg-mist p-6 text-center ${className}`}>
    <div className="max-w-[440px]">
      <p className="text-[16px] font-medium text-ink">External content is off</p>
      <p className="mt-3 text-[13px] leading-[1.8] text-muted">To display this map, allow external content in your cookie preferences. The provider will receive your IP address and may use its own cookies.</p>
      <button type="button" onClick={openCookieSettings} className="mt-5 min-h-11 cursor-pointer rounded-[2px] bg-black px-6 text-[13px] font-medium text-white transition-opacity hover:opacity-75">Cookie settings</button>
    </div>
  </div>;
}
