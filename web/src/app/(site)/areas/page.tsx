import type { Metadata } from "next";
import CommunityDirectory from "@/components/areas/CommunityDirectory";
import { getPage, seoMetadata } from "@/lib/content";
import communities from "../../../../content/communities.json";

export const metadata: Metadata = seoMetadata(getPage("/areas/")!);

export default function AreasPage() {
  return <section className="pl-areas-page bg-white pb-20 pt-14 md:pb-24 md:pt-20">
    <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
      <div className="mx-auto mb-8 max-w-[900px] text-center md:mb-10">
        <h1 className="text-[30px] font-normal leading-[1.2] tracking-[-0.025em] text-ink sm:text-[38px] md:text-[46px]">Top Dubai Communities</h1>
        <p className="mx-auto mt-5 max-w-[830px] text-[14px] leading-[1.8] text-muted md:text-[15px]">Explore Dubai’s waterfront neighbourhoods, urban districts and established residential communities. Discover the setting that suits your lifestyle, then browse available properties with Prestige Luxury Real Estate.</p>
      </div>
      <CommunityDirectory communities={communities} />
    </div>
  </section>;
}
