import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { decodeEntities, excerptText, formatDate, postImage, primaryCategory } from "./blog";

/** Neutral block shown when a post's featured image file is missing. */
export function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-smoke text-[#c9c9c9] ${className}`} aria-hidden>
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="4" width="18" height="16" rx="1.5" />
        <circle cx="9" cy="10" r="2" />
        <path d="m4 18 5-5 4 4 3-3 4 4" />
      </svg>
    </div>
  );
}

/** Houzez "blog-post-item": image, meta, title, excerpt, "Continue reading". */
export default function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  const image = postImage(post);
  const cat = primaryCategory(post);
  const title = decodeEntities(post.title);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-line bg-white transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_14px_34px_rgba(0,0,0,0.09)]">
      <Link href={post.path} className="relative block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden>
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <ImagePlaceholder className="absolute inset-0" />
        )}
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-2 text-[12px] uppercase tracking-[0.04em] text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {cat && (
            <>
              <span aria-hidden>•</span>
              <Link href={cat.path} className="transition-colors hover:text-accent">
                {cat.name}
              </Link>
            </>
          )}
        </div>
        <h2 className="mt-3 text-[18px] font-medium leading-snug text-ink">
          <Link href={post.path} className="transition-colors duration-200 hover:text-accent">
            {title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-[14px] leading-[1.7] text-body">{excerptText(post)}</p>
        <Link href={post.path} className="group/more mt-5 inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-ink transition-colors hover:text-accent">
          Continue reading <span aria-hidden className="transition-transform duration-300 group-hover/more:translate-x-1">→</span>
          <span className="sr-only">: {title}</span>
        </Link>
      </div>
    </article>
  );
}
