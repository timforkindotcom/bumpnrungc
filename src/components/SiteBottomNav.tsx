"use client";

import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import { getVisibleTabs, type SiteTabId } from "@/lib/nav";

type SiteBottomNavProps = {
  content: SiteContent;
  activeId?: SiteTabId | null;
  activeHref?: string;
  onSelectTab?: (id: SiteTabId | null) => void;
};

export function SiteBottomNav({
  content,
  activeId,
  activeHref,
  onSelectTab,
}: SiteBottomNavProps) {
  const tabs = getVisibleTabs(content);
  if (tabs.length === 0) return null;

  return (
    <nav
      aria-label="Site"
      className="relative z-20 border-t border-white/10 bg-forest px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-1">
        {tabs.map((tab) => {
          const isActive = activeId === tab.id || activeHref === tab.href;
          const featured = Boolean(tab.featured);

          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={(event) => {
                if (!onSelectTab) return;
                event.preventDefault();
                onSelectTab(isActive ? null : tab.id);
              }}
              className={
                featured
                  ? `font-label mx-1 rounded-md px-3 py-2.5 text-center text-[11px] leading-tight uppercase shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:px-4 sm:text-xs ${
                      isActive
                        ? "bg-[#e6b82e] text-ink"
                        : "bg-[#f2c94c] text-ink hover:bg-[#ffd65a]"
                    }`
                  : `font-label rounded-sm px-1.5 py-2 text-center text-[10px] uppercase sm:text-xs ${
                      isActive
                        ? "bg-cream/15 text-cream"
                        : "text-cream/55 hover:bg-white/5 hover:text-cream"
                    }`
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
