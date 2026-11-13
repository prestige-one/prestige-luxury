// Single blog posts whose original URL is /real-estate/real-estate-analysis/<slug>/
import { postRoute } from "@/components/blog/PostView";

const route = postRoute("/real-estate/real-estate-analysis/");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
