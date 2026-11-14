import Link from "next/link";
import Media from "@/components/Media";
import { Button } from "@/components/ui";
import PropertyImageSlider from "@/components/listings/PropertyImageSlider";
import ProjectSlider from "./ProjectSlider";
import { isPagePublished } from "@/lib/site";

const up = (file: string) => `/wp-content/uploads/2023/05/${file}`;
const projects = [
  {
    title: "The Residence", href: "/the-residence-by-prestige-one/", listingQuery: "The Residence By Prestige One", location: "Jumeirah Village Circle",
    text: "Contemporary apartments, a landscaped roof deck and thoughtfully designed spaces for a balanced city lifestyle.",
    images: ["The-Residence-banner-5-scaled-1.jpg", "Pool-Residence-bottom-gallery.jpg", "The-residence-kitchen-living.jpg", "The-residence-bedroom.jpg", "Roof-deck-Residence-bottom-gallery.jpg"],
  },
  {
    title: "Vista", href: "/vista-by-prestige-one/", listingQuery: "Vista by Prestige One", location: "Dubai Sports City · Victory Heights",
    text: "Golf-course views, a rooftop infinity pool and leisure amenities that bring a fresh perspective to everyday living.",
    images: ["Vista-by-prestige-One-Top-Banner-scaled.jpg", "Living2-Vista-gallery.jpg", "Pool-Vista-gallery.jpg", "Vista-bedroom-gallery.jpg", "Outdoor-Cinema-Vista-amenities-gallery.jpg"],
  },
];

export default function PrestigeOneProjects() {
  return <section className="pl-prestige-projects relative overflow-hidden bg-black py-16 text-white md:py-24">
    <div aria-hidden className="pointer-events-none absolute -bottom-12 -left-6 select-none text-[220px] font-light leading-none tracking-tighter text-white/[0.025] md:text-[360px]">Prestige One</div>
    <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
      <div className="lg:pt-2">
        <Media src="/brand/developers/prestige-one-developments.webp" alt="Prestige One Developments" width={180} height={72} className="mb-8 h-16 w-[180px] object-contain object-left brightness-0 invert" />
        <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-white/60">A different perspective on Dubai</p>
        <h2 className="max-w-[460px] font-medium leading-[1.25] tracking-[-0.02em] text-section">Distinctive homes.<br />Considered living.</h2>
        <p className="mt-5 max-w-[440px] text-[14px] leading-[1.85] text-white/70">Discover Prestige One projects where contemporary architecture, thoughtful amenities and connected communities come together. Find the setting for your next chapter in Dubai.</p>
        <Button href="/developers/prestige-one-developments/" variant="light" className="mt-7">Discover Prestige One</Button>
      </div>
      <ProjectSlider count={projects.length}>
        {projects.map((p) => {
          const published = isPagePublished(p.href);
          const href = published ? p.href : `/search-results/?q=${encodeURIComponent(p.listingQuery)}`;
          return <article key={p.title} className="pl-project-slide group w-[88%] flex-none snap-start sm:w-[76%] lg:w-[64%]">
          <PropertyImageSlider title={p.title} href={href} images={p.images.map(up)} className="rounded-[4px]" />
          <div className="pt-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">Prestige One Developments</p>
            <h3 className="mt-2 text-[23px] font-medium"><Link href={href} className="transition-opacity hover:opacity-70">{p.title}</Link></h3>
            <p className="mt-2 text-[13px] text-white/75">{p.location}</p>
            <p className="mt-4 max-w-[440px] text-[13px] leading-[1.8] text-white/65">{p.text}</p>
            <Link href={href} className="mt-5 inline-flex items-center gap-3 border-b border-white/40 pb-2 text-[13px] transition-opacity hover:opacity-65">{published ? "Explore project" : "View available properties"} <span aria-hidden>↗</span></Link>
          </div>
        </article>; })}
      </ProjectSlider>
    </div>
  </section>;
}
