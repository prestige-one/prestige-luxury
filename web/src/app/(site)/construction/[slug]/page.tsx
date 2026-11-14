import { postRoute } from "@/components/blog/PostView";

const route = postRoute("/construction/");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
