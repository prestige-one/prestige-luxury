import { notFound } from "next/navigation";
import { isPagePublished } from "./site";

/** Stop rendering before any draft page content is sent. Next.js supplies a 404 and noindex. */
export function requirePublishedPage(path: string) {
  if (!isPagePublished(path)) notFound();
}
