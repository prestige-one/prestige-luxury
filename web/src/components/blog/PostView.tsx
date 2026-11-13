import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Container, WpContent } from "@/components/ui";
import { getPost, seoMetadata, type Post } from "@/lib/content";
import { site } from "@/lib/site";
import BlogSidebar from "./BlogSidebar";
import PostCard from "./PostCard";
import ShareLinks from "./ShareLinks";
import {
  adjacentPosts,
  categoriesOf,
  cleanPostHtml,
  decodeEntities,
  excerptText,
  formatDate,
  postImage,
  postsWithPrefix,
  primaryCategory,
  relatedPosts,
  tagPath,
  tagsOf,
} from "./blog";

/**
 * Builds the exports of a single-post route for posts whose URL is `<prefix><slug>/`.
 * Each route file re-exports these and sets `dynamicParams = false` itself.
 */
export function postRoute(prefix: string) {
  type Props = { params: Promise<{ slug: string }> };
  const find = async (params: Props["params"]) => getPost(`${prefix}${(await params).slug}/`);
  return {
    generateStaticParams: () => postsWithPrefix(prefix).map((p) => ({ slug: p.path.slice(prefix.length, -1) })),
    generateMetadata: async ({ params }: Props): Promise<Metadata> => {
      const post = await find(params);
      if (!post) return {};
      // Some old posts store an unresolved Yoast template ("% %") as description: fall back to the excerpt.
      const description = /[a-z]{3}/i.test(post.seo.description) ? post.seo.description : excerptText(post, 155);
      const meta = seoMetadata({ ...post, title: decodeEntities(post.title), seo: { ...post.seo, description } });
      return {
        ...meta,
        openGraph: { ...meta.openGraph, type: "article", publishedTime: post.date, modifiedTime: post.modified, authors: [post.author] },
      };
    },
    Page: async function PostPage({ params }: Props) {
      const post = await find(params);
      if (!post) notFound();
      return <PostView post={post} />;
    },
  };
}

export default function PostView({ post }: { post: Post }) {
  const title = decodeEntities(post.title);
  const image = postImage(post);
  const cats = categoriesOf(post);
  const primary = primaryCategory(post);
  const postTags = tagsOf(post);
  const related = relatedPosts(post);
  const { newer, older } = adjacentPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: post.date,
    dateModified: post.modified,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name },
    image: image ? site.url + image : undefined,
    mainEntityOfPage: site.url + post.path,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="border-b border-line bg-mist py-10">
        <Container>
          <Breadcrumb items={[{ label: "Blog", href: "/blog/" }, ...(primary && primary.slug !== "blog" ? [{ label: primary.name, href: primary.path }] : [])]} />
          <h1 className="mt-3 max-w-[900px] text-[28px] font-medium leading-tight text-ink md:text-[36px]">{title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
            <span>
              By <span className="text-ink">{post.author}</span>
            </span>
            <span aria-hidden>•</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {cats.length > 0 && (
              <>
                <span aria-hidden>•</span>
                <span className="flex flex-wrap gap-x-1.5">
                  {cats.map((c, i) => (
                    <span key={c.id}>
                      <Link href={c.path} className="hover:text-accent">
                        {c.name}
                      </Link>
                      {i < cats.length - 1 && ","}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            {image && (
              <Image
                src={image}
                alt={title}
                width={1200}
                height={675}
                priority
                sizes="(min-width: 1140px) 780px, 100vw"
                className="mb-10 h-auto w-full"
              />
            )}
            <WpContent
              html={cleanPostHtml(post.html)}
              className="[&_.elementor-heading-title]:mt-0 [&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_table]:block [&_table]:overflow-x-auto md:[&_table]:table"
            />

            <div className="mt-12 flex flex-col gap-6 border-y border-line py-6 md:flex-row md:items-center md:justify-between">
              {postTags.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[13px] font-medium uppercase tracking-[0.06em] text-ink">Tags</span>
                  {postTags.map((t) => (
                    <Link
                      key={t.id}
                      href={tagPath(t)}
                      className="border border-line px-2.5 py-1 text-[12px] text-body transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <span />
              )}
              <ShareLinks path={post.path} title={title} />
            </div>

            {(older || newer) && (
              <nav aria-label="More posts" className="mt-8 grid gap-4 sm:grid-cols-2">
                {older ? (
                  <Link href={older.path} className="group border border-line p-5 hover:border-ink">
                    <span className="text-[12px] uppercase tracking-[0.06em] text-muted">‹ Previous post</span>
                    <span className="mt-1 block text-[14px] font-medium leading-snug text-ink group-hover:text-accent">{decodeEntities(older.title)}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {newer && (
                  <Link href={newer.path} className="group border border-line p-5 text-right hover:border-ink">
                    <span className="text-[12px] uppercase tracking-[0.06em] text-muted">Next post ›</span>
                    <span className="mt-1 block text-[14px] font-medium leading-snug text-ink group-hover:text-accent">{decodeEntities(newer.title)}</span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <BlogSidebar currentPath={post.path} />
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-line pt-14">
            <h2 className="mb-8 font-heading text-[26px] text-ink">Related Posts</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
