import type { IconName } from "@/lib/site";

/**
 * Small outline icons shown beside the "properties by type" links in the mega menu.
 * Same drawing conventions as `SocialIcon` in components/icons.tsx (24×24 box, currentColor
 * stroke), kept here because components/icons.tsx is a shared file this feature does not own.
 */
export function NavIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  switch (name) {
    case "apartment":
      return (
        <svg {...p}>
          <path d="M4 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16" />
          <path d="M13 10h6a1 1 0 0 1 1 1v10" />
          <path d="M2 21h20M7 8h2M7 12h2M7 16h2M16 14h1M16 18h1" />
        </svg>
      );
    case "villa":
      return (
        <svg {...p}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10.5V21h14V10.5" />
          <path d="M10 21v-5.5h4V21M2 21h20" />
        </svg>
      );
    case "townhouse":
      return (
        <svg {...p}>
          <path d="M2 11 7 6.5 12 11v10H2z" />
          <path d="M12 11l5-4.5L22 11v10H12z" />
          <path d="M6 21v-4h2v4M16 21v-4h2v4M1 21h22" />
        </svg>
      );
    case "studio":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <path d="M3 14h7V4M10 17.5h4" />
        </svg>
      );
    case "commercial":
      return (
        <svg {...p}>
          <path d="M3 9.5 5 4h14l2 5.5" />
          <path d="M4 9.5V21h16V9.5M2 9.5h20" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      );
    case "office":
      return (
        <svg {...p}>
          <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
          <path d="M3 21h18M9.5 7h1.5M13 7h1.5M9.5 11h1.5M13 11h1.5M9.5 15h1.5M13 15h1.5" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
        </svg>
      );
    default:
      return null;
  }
}

/** The chevron on nav items that open a panel. */
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
