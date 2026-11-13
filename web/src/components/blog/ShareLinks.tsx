import { SocialIcon } from "@/components/icons";
import { site } from "@/lib/site";

/** Plain share links (no third-party scripts). */
export default function ShareLinks({ path, title }: { path: string; title: string }) {
  const url = encodeURIComponent(site.url + path);
  const text = encodeURIComponent(title);
  const links = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, icon: <SocialIcon name="Facebook" /> },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, icon: <SocialIcon name="LinkedIn" /> },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.9Zm-1.1 16.2h1.7L7.4 4.7H5.6Z" />
        </svg>
      ),
    },
    { name: "WhatsApp", href: `https://wa.me/?text=${text}%20${url}`, icon: <SocialIcon name="WhatsApp" /> },
  ];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[13px] font-medium uppercase tracking-[0.06em] text-ink">Share</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.name}`}
          className="flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}
