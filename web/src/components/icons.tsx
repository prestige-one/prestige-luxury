export function SocialIcon({ name, size = 15 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true } as const;
  switch (name) {
    case "Facebook":
      return (
        <svg {...p}>
          <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...p}>
          <path d="M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h4v1.6A4 4 0 0 1 20 13v7h-4v-6a2 2 0 0 0-4 0v6h-2z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...p}>
          <rect x="2.5" y="5" width="19" height="14" rx="3" />
          <path d="m10 9 5 3-5 3z" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg {...p}>
          <path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 7.7 19.6Z" />
          <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a5 5 0 0 1-2.3-2.3l.8-1-1-2Z" />
        </svg>
      );
    default:
      return null;
  }
}
