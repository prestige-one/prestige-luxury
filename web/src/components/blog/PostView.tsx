import Media from "@/components/Media";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, WpContent } from "@/components/ui";
import { getPost, seoMetadata, type Post } from "@/lib/content";
import { site } from "@/lib/site";
import CategoryLinks from "./CategoryLinks";
import PostCard from "./PostCard";
import ShareLinks from "./ShareLinks";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import {
  adjacentPosts,
  categoriesOf,
  cleanPostHtml,
  decodeEntities,
  excerptText,
  formatDate,
  postImage,
  postsWithPrefix,
  relatedPosts,
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
      const meta = seoMetadata({ ...post, title: decodeEntities(post.title), seo: { ...post.seo, description } }, { image: postImage(post) });
      return {
        ...meta,
        openGraph: { ...meta.openGraph, type: "article", publishedTime: post.date, modifiedTime: post.modified, authors: [site.name] },
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
  const related = relatedPosts(post);
  const { newer, older } = adjacentPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: post.date,
    dateModified: post.modified,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name },
    image: image ? site.url + image : undefined,
    mainEntityOfPage: site.url + post.path,
    description: excerptText(post, 155),
    articleSection: cats.map((category) => category.name),
  };

  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Blog", path: "/blog/" }, { name: title, path: post.path }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="pl-blog-heading bg-black py-12 text-white md:py-16">
        <Container>
          <h1 className="max-w-[900px] text-[28px] font-medium leading-tight text-white md:text-[36px]">{title}</h1>
          <div className="mt-5"><CategoryLinks categories={cats} light label="Article categories above content" /></div>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/70">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>•</span>
            <span>{Math.max(1, Math.ceil(post.html.replace(/<[^>]*>/g, ' ').split(/\s+/).length / 200))} min read</span>
          </div>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
          <article className="pl-blog-article mx-auto min-w-0 max-w-[860px]">
            {image && (
              <Media
                src={image}
                alt={title}
                width={1200}
                height={675}
                priority
                sizes="(min-width: 1024px) 860px, 100vw"
                className="mb-10 h-auto w-full"
              />
            )}
            <WpContent
              html={cleanPostHtml(post.html)}
              className="pl-blog-content [&_table]:block [&_table]:overflow-x-auto md:[&_table]:table"
            />

            <div className="mt-10 border-t border-line pt-6">
              <p className="mb-3 text-[13px] font-medium text-muted">Filed under</p>
              <CategoryLinks categories={cats} label="Article categories below content" />
            </div>

            <div className="mt-12 flex flex-col gap-6 border-y border-line py-6 md:flex-row md:items-center md:justify-between">
              <p className="text-[13px] font-medium text-muted">Share this article</p>
              <ShareLinks path={post.path} title={title} />
            </div>

            {(older || newer) && (
              <nav aria-label="More posts" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
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


        {related.length > 0 && (
          <section className="mt-20 border-t border-line pt-14">
            <h2 className="mb-8 font-heading text-ink text-section">Related Posts</h2>
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
