// Single blog posts whose original URL is /blog/<slug>/
import { postRoute } from "@/components/blog/PostView";

const route = postRoute("/blog/");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
