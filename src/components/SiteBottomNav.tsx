"use client";

import Link from "next/link";
import { SITE_TABS, type SiteTabId } from "@/lib/nav";

type SiteBottomNavProps = {
  activeId?: SiteTabId | null;
  activeHref?: string;
  onSelectTab?: (id: SiteTabId | null) => void;
};

export function SiteBottomNav({
  activeId,
  activeHref,
  onSelectTab,
}: SiteBottomNavProps) {
  return (
    <nav
      aria-label="Site"
      className="relative z-20 border-t border-white/10 bg-forest px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-[1fr_1fr_auto_1fr_1fr] items-center gap-1">
        {SITE_TABS.map((tab) => {
          const isActive = activeId === tab.id || activeHref === tab.href;
          const featured = "featured" in tab && tab.featured;

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
                  ? `font-label mx-1 rounded-md px-3 py-2.5 text-center text-[10px] leading-tight uppercase tracking-[0.12em] shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:px-4 sm:text-[11px] sm:tracking-[0.14em] ${
                      isActive
                        ? "bg-[#e6b82e] text-ink"
                        : "bg-[#f2c94c] text-ink hover:bg-[#ffd65a]"
                    }`
                  : `font-label rounded-sm px-1.5 py-2 text-center text-[9px] uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.16em] ${
                      isActive
                        ? "bg-cream/15 text-cream"
                        : "text-cream/55 hover:bg-white/5 hover:text-cream"
                    }`
              }
            >
              {featured ? (
                <span className="block">
                  Book
                  <span className="hidden sm:inline"> </span>
                  <span className="block sm:inline">Services</span>
                </span>
              ) : (
                tab.label
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
