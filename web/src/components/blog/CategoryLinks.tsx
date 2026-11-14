import Link from "next/link";
import type { Category } from "@/lib/content";

/** Shared inline taxonomy navigation for archives and both ends of an article. */
export default function CategoryLinks({ categories, light = false, label = "Categories", all = false, activePath }: {
  categories: Category[]; light?: boolean; label?: string; all?: boolean; activePath?: string;
}) {
  const links = [...(all ? [{ id: 0, name: "All articles", path: "/blog/" }] : []), ...categories];
  return (
    <nav aria-label={label} className="pl-blog-categories flex flex-wrap items-center gap-2">
      {links.map((category) => (
        <Link key={category.id} href={category.path} aria-current={category.path === activePath ? "page" : undefined}
          className={`rounded-[2px] border px-3 py-1.5 text-[12px] transition-colors ${light
            ? "border-white/30 text-white hover:bg-white hover:text-black aria-[current=page]:bg-white aria-[current=page]:text-black"
            : "border-line text-ink hover:border-black hover:bg-black hover:text-white aria-[current=page]:bg-black aria-[current=page]:text-white"}`}>
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
