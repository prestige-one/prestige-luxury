import Media from "@/components/Media";
import Link from "next/link";
import { posts } from "@/lib/content";
import { ImagePlaceholder } from "./PostCard";
import { activeCategories, activeTags, decodeEntities, formatDate, postImage, postsInCategory, tagPath } from "./blog";

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-white p-6">
      <h2 className="mb-4 border-b border-line pb-3 text-[16px] font-medium text-ink">{title}</h2>
      {children}
    </section>
  );
}

/** Right-hand blog sidebar: categories, recent posts, tags. */
export default function BlogSidebar({ currentPath }: { currentPath?: string }) {
  const parents = activeCategories.filter((c) => c.parent === 0 || !activeCategories.some((p) => p.id === c.parent));
  const recent = posts.filter((p) => p.path !== currentPath).slice(0, 5);
  return (
    <aside className="space-y-8">
      <Widget title="Categories">
        <ul className="space-y-0.5 text-[14px]">
          {parents.map((c) => (
            <li key={c.id}>
              <CategoryLink path={c.path} name={c.name} count={postsInCategory(c).length} active={c.path === currentPath} />
              {activeCategories
                .filter((s) => s.parent === c.id)
                .map((s) => (
                  <div key={s.id} className="pl-4">
                    <CategoryLink path={s.path} name={s.name} count={postsInCategory(s).length} active={s.path === currentPath} />
                  </div>
                ))}
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Recent Posts">
        <ul className="space-y-4">
          {recent.map((p) => {
            const img = postImage(p);
            return (
              <li key={p.id}>
                <Link href={p.path} className="group flex gap-3">
                  <span className="relative block h-[60px] w-[80px] shrink-0 overflow-hidden">
                    {img ? (
                      <Media src={img} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <ImagePlaceholder className="absolute inset-0 [&_svg]:h-6 [&_svg]:w-6" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-[13.5px] font-medium leading-snug text-ink group-hover:text-accent">
                      {decodeEntities(p.title)}
                    </span>
                    <span className="mt-1 block text-[12px] text-muted">{formatDate(p.date)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Widget>

      <Widget title="Tags">
        <ul className="flex flex-wrap gap-2">
          {activeTags.map((t) => (
            <li key={t.id}>
              <Link
                href={tagPath(t)}
                className={`inline-block border px-2.5 py-1 text-[12px] transition-colors hover:border-ink hover:bg-ink hover:text-white ${
                  tagPath(t) === currentPath ? "border-ink bg-ink text-white" : "border-line text-body"
                }`}
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </Widget>
    </aside>
  );
}

function CategoryLink({ path, name, count, active }: { path: string; name: string; count: number; active: boolean }) {
  return (
    <Link href={path} className={`flex items-center justify-between py-1.5 hover:text-accent ${active ? "text-accent" : "text-body"}`}>
      <span>{name}</span>
      <span className="text-[12px] text-muted">({count})</span>
    </Link>
  );
}
