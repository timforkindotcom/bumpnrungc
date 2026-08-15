"use client";

import type { SiteContent } from "@/lib/content";
import type { TabId } from "@/components/HomeClient";
import { SiteBottomNav } from "@/components/SiteBottomNav";

type BottomTabsProps = {
  content: SiteContent;
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
};

export function BottomTabs({ content, activeTab, onSelect }: BottomTabsProps) {
  return (
    <SiteBottomNav
      content={content}
      activeId={activeTab}
      onSelectTab={onSelect}
    />
  );
}
