// Single blog posts whose original URL is /luxury-property-market/<slug>/
import { postRoute } from "@/components/blog/PostView";

const route = postRoute("/luxury-property-market/");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
