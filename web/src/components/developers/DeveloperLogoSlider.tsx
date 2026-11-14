import Link from "next/link";
import Media from "@/components/Media";
import { featuredDevelopers } from "@/lib/developers";
import { developerLogo, developerLogoClass } from "@/lib/developer-logos";

/** Server-rendered logo strip shared by the homepage and developer directory. */
export default function DeveloperLogoSlider() {
  const developers = featuredDevelopers().map((developer) => ({
    slug: developer.slug, name: developer.name, logo: developerLogo(developer.slug),
  }));
  return (
    <section className="pl-developer-slider overflow-hidden border-y border-line bg-cream py-7" aria-label="Our registered developers">
      <div className="flex w-max animate-marquee items-center gap-12" role="group" aria-label="Developer logos">
        {[0, 1, 2, 3].flatMap((copy) => developers.map((developer) => (
          <Link key={`${copy}-${developer.slug}`} href={`/developers/${developer.slug}/`} aria-hidden={copy ? true : undefined} tabIndex={copy ? -1 : undefined}
            className="flex h-[46px] w-[150px] shrink-0 items-center justify-center transition-transform duration-300 hover:scale-[1.03] motion-reduce:transition-none md:h-[54px] md:w-[180px]">
            {developer.logo ? (
              <Media src={developer.logo} alt={developer.name} width={180} height={54} unoptimized className={`h-full w-full object-contain ${developerLogoClass(developer.slug)}`} />
            ) : <span className="whitespace-nowrap text-[17px] font-medium uppercase tracking-[0.14em] text-ink">{developer.name}</span>}
          </Link>
        )))}
      </div>
    </section>
  );
}
