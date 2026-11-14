import { permanentRedirect } from "next/navigation";

/** WordPress tag archives are retired; categories provide article navigation. */
export default function RetiredTagArchive() {
  permanentRedirect("/blog/");
}
