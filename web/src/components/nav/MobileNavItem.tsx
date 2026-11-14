"use client";

import Link from "next/link";
import type { NavGroup, NavItem } from "@/lib/site";
import { Chevron } from "./NavIcon";

/**
 * One row of the mobile drawer. Items with a mega panel (or a plain `children` list) collapse
 * into an accordion showing the group labels and their links; plain items are just a link.
 * Every tap target is at least 44px tall.
 */
export default function MobileNavItem({
  item,
  active,
  pathname,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  // Mega items keep their group labels; a plain `children` dropdown becomes one unlabelled group.
  const groups: NavGroup[] = item.mega ? item.mega.groups : item.children ? [{ links: item.children }] : [];
  const sectionId = `mobile-nav-${item.href.replace(/\W+/g, "-")}`;

  return (
    <li className="border-b border-white/10 last:border-0">
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? (pathname === item.href ? "page" : "location") : undefined}
          className={`flex min-h-[54px] flex-1 items-center gap-3 text-[14px] font-medium uppercase tracking-[0.08em] transition-colors ${
            active ? "text-white" : "text-white/80 hover:text-white"
          }`}
        >
          <span aria-hidden className={`h-[2px] bg-white transition-[width] duration-300 ${active ? "w-4" : "w-0"}`} />
          {item.label}
        </Link>
        {groups.length > 0 && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={sectionId}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
            className="-mr-2 grid h-11 w-11 shrink-0 place-items-center text-white/70 transition-colors hover:text-white"
          >
            <Chevron className={`transition-transform duration-300 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {groups.length > 0 && (
        <div
          id={sectionId}
          hidden={!expanded}
          className="pb-3 pl-4"
        >
          {groups.map((group, i) => (
            <div key={group.title ?? i} className={i > 0 ? "mt-4" : ""}>
              {group.title && (
                <p className="pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">{group.title}</p>
              )}
              <ul>
                {group.links.map((c) => (
                  <li key={c.label + c.href}>
                    <Link
                      href={c.href}
                      onClick={onNavigate}
                      className={`flex min-h-[44px] items-center text-[14px] transition-colors ${
                        pathname.startsWith(c.href) ? "text-white" : "text-white/65 hover:text-white"
                      }`}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}
