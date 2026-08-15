"use client";

import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import { getVisibleTabs, type SiteTabId, type VisibleTab } from "@/lib/nav";

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

  const featuredIndex = tabs.findIndex((tab) => tab.featured);
  const featured = featuredIndex >= 0 ? tabs[featuredIndex] : null;
  const left = featuredIndex >= 0 ? tabs.slice(0, featuredIndex) : tabs;
  const right = featuredIndex >= 0 ? tabs.slice(featuredIndex + 1) : [];

  const renderTab = (tab: VisibleTab) => {
    const isActive = activeId === tab.id || activeHref === tab.href;
    const featuredTab = Boolean(tab.featured);

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
          featuredTab
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
  };

  return (
    <nav
      aria-label="Site"
      className="relative z-20 border-t border-white/10 bg-forest px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-1">
        <div className="flex items-center justify-end gap-1">
          {left.map(renderTab)}
        </div>
        <div className="flex justify-center">{featured ? renderTab(featured) : null}</div>
        <div className="flex items-center justify-start gap-1">
          {right.map(renderTab)}
        </div>
      </div>
    </nav>
  );
}
