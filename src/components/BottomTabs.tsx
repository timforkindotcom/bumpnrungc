"use client";

import Link from "next/link";
import type { TabId } from "@/components/HomeClient";
import { SITE_TABS } from "@/lib/nav";

type BottomTabsProps = {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
};

export function BottomTabs({ activeTab, onSelect }: BottomTabsProps) {
  return (
    <nav
      aria-label="Site"
      className="relative z-20 border-t border-white/10 bg-forest px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1">
        {SITE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={(event) => {
                event.preventDefault();
                onSelect(isActive ? null : tab.id);
              }}
              className={`font-label rounded-sm px-1.5 py-2 text-center text-[9px] uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.16em] ${
                isActive
                  ? "bg-cream/15 text-cream"
                  : "text-cream/55 hover:bg-white/5 hover:text-cream"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
