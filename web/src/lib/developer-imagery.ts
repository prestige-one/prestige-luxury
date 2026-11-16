import type { Developer } from "./developers";
import photography from "../../content/developer-images.json";

type DeveloperImage = { src: string; alt: string };

// Explicit selections prevent developers in the same community from sharing one fallback.
// Community photographs describe their location rather than claiming a building's ownership.
const images: Record<string, DeveloperImage> = photography;
const skyline: DeveloperImage = { src: "/images/downtown-dubai.webp", alt: "Dubai's Downtown skyline" };

export function developerCardImage(d: Developer): DeveloperImage {
  return images[d.slug] ?? skyline;
}
