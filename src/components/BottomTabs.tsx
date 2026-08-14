"use client";

import type { TabId } from "@/components/HomeClient";
import { SiteBottomNav } from "@/components/SiteBottomNav";

type BottomTabsProps = {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
};

export function BottomTabs({ activeTab, onSelect }: BottomTabsProps) {
  return <SiteBottomNav activeId={activeTab} onSelectTab={onSelect} />;
}
