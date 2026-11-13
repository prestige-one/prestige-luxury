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
    // The modern X mark (not the old bird). Solid, so it overrides the shared stroke props.
    case "X":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="M17.53 3h2.9l-6.34 7.24L21.5 21h-5.73l-4.49-5.87L6.14 21H3.24l6.78-7.75L2.5 3h5.88l4.06 5.37ZM16.5 19.27h1.6L7.56 4.64H5.84Z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * The WhatsApp logo as a solid glyph, for the floating contact button.
 * Drawn inline (no image file) so it inherits `currentColor` and stays crisp at any size.
 */
export function WhatsAppGlyph({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2Zm0 1.84c2.15 0 4.17.84 5.69 2.36a8 8 0 0 1 2.36 5.7c0 4.47-3.63 8.1-8.06 8.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.1 8.1 0 0 1-1.25-4.33c0-4.46 3.63-8.09 8.09-8.09Zm-3.6 4.07c-.17 0-.44.06-.68.31-.23.25-.89.87-.89 2.12s.91 2.46 1.04 2.63c.13.17 1.76 2.82 4.3 3.86 2.11.86 2.54.69 3 .64.46-.04 1.48-.6 1.69-1.19.21-.59.21-1.09.15-1.19-.06-.11-.23-.17-.48-.29-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.38-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42Z" />
    </svg>
  );
}
