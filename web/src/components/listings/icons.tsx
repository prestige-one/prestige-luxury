// Small line icons used on listing cards and the property page (Houzez style).
type P = { size?: number; className?: string };

const base = (size: number, className?: string) =>
  ({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className,
  }) as const;

export const BedIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M2 18V6M2 14h20v4M22 14v-2a3 3 0 0 0-3-3h-8v5" />
    <circle cx="6.5" cy="10.5" r="1.8" />
  </svg>
);

export const BathIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V5a2 2 0 0 1 3.5-1.3M7 19l-1 2M17 19l1 2" />
  </svg>
);

export const AreaIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6M3 3l7 7M21 3l-7 7M3 21l7-7M21 21l-7-7" />
  </svg>
);

export const HomeIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5" />
  </svg>
);

export const PinIcon = ({ size = 14, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const ListIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1" />
  </svg>
);

export const GridIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

export const PhoneIcon = ({ size = 16, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);

export const WhatsAppIcon = ({ size = 16, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.1Z" />
    <path d="M9 8.5c0 3.5 2.5 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 0 1-2.8-2.8l.8-1-1-2Z" />
  </svg>
);

export const ChevronIcon = ({ size = 20, className, dir = "right" }: P & { dir?: "left" | "right" }) => (
  <svg {...base(size, className)}>
    <path d={dir === "right" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} />
  </svg>
);

export const CloseIcon = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);

export const ExpandIcon = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);

export const CheckIcon = ({ size = 16, className }: P) => (
  <svg {...base(size, className)}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);
