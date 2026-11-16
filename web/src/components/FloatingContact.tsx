import Image from "next/image";
import { site } from "@/lib/site";
import { SocialIcon } from "./icons";

const socialOrder = ["YouTube", "LinkedIn", "WhatsApp", "X", "Instagram", "Facebook"];
const brandHover: Record<string, string> = {
  YouTube: "hover:text-[#ff0033] focus-visible:text-[#ff0033]",
  LinkedIn: "hover:text-[#0a66c2] focus-visible:text-[#0a66c2]",
  WhatsApp: "hover:text-[#25d366] focus-visible:text-[#25d366]",
  X: "hover:text-black focus-visible:text-black",
  Instagram: "",
  Facebook: "hover:text-[#0866ff] focus-visible:text-[#0866ff]",
};
const socialLinks = socialOrder.flatMap((name) => {
  if (name === "WhatsApp") return [{ name, href: `${site.whatsappHref}?text=${encodeURIComponent(`Hello ${site.name}, I'd like to enquire about a property.`)}` }];
  const social = site.socials.find((item) => item.name === name);
  return social ? [social] : [];
});

function SocialLinks() {
  return (
    <ul className="rounded-full border border-black/10 bg-white p-0.5 shadow-[0_4px_18px_rgba(0,0,0,0.12)]">
      {socialLinks.map(({ name, href }) => (
        <li key={name}>
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on ${name}`}
            className={`pl-sidebar-social-link group relative flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5 focus-visible:bg-black/5 focus-visible:outline-black motion-reduce:transition-none min-[1360px]:size-9 ${brandHover[name]}`}>
            {name === "Instagram" ? (
              <span className="pl-sidebar-instagram relative inline-flex size-[19px] shrink-0">
                <span className="inline-flex transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none"><SocialIcon name={name} size={19} /></span>
                {/* Use Instagram's own gradient asset rather than approximating it with one pink. */}
                <Image src="/images/social/instagram-brand.webp" alt="" aria-hidden width={19} height={19} unoptimized loading="eager" className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
              </span>
            ) : <SocialIcon name={name} size={19} />}
            <span aria-hidden="true" className="pointer-events-none invisible absolute left-full ml-3 whitespace-nowrap rounded-[6px] border border-white/15 bg-[#111] px-3 py-1.5 text-[12px] font-medium text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 motion-reduce:transition-none">{name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function FloatingContact() {
  return (
    <>
      <nav aria-label="Floating social links" className="fixed left-2 top-1/2 z-40 hidden -translate-y-1/2 min-[1360px]:block">
        <SocialLinks />
      </nav>
      <details className="group fixed bottom-20 left-5 z-40 min-[1360px]:hidden">
        <summary aria-label="Social media links" className="flex size-12 cursor-pointer list-none items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" /></svg>
        </summary>
        <nav aria-label="Mobile social links" className="absolute bottom-full left-0 mb-3"><SocialLinks /></nav>
      </details>
      <a href={site.phoneHref} aria-label={`Call ${site.name} on ${site.phone}`}
        className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center gap-3 rounded-full border border-white/20 bg-black py-2 pl-2 pr-5 text-white shadow-[0_4px_18px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#292929] focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none md:bottom-6 md:right-6">
        <span className="grid size-9 place-items-center rounded-full border border-white/25">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" /></svg>
        </span>
        <span className="text-[13px] font-medium tracking-[0.02em]">Call Us</span>
      </a>
    </>
  );
}
