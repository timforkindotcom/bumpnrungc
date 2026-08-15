"use client";

import type { SiteContent } from "@/lib/content";
import { contactTitle, servicesTitle } from "@/lib/content";
import { getVisibleTabs } from "@/lib/nav";
import { isPhoneLike } from "@/lib/device";
import { Header } from "@/components/Header";
import { UnityGame } from "@/components/UnityGame";
import { BottomTabs } from "@/components/BottomTabs";
import { ScorecardPopup } from "@/components/ScorecardPopup";
import { LocationPopup } from "@/components/popups/LocationPopup";
import { AboutPopup } from "@/components/popups/AboutPopup";
import { ServicesPopup } from "@/components/popups/ServicesPopup";
import { ContactPopup } from "@/components/popups/ContactPopup";
import { MerchPopup } from "@/components/popups/MerchPopup";
import { useEffect, useMemo, useState } from "react";

export type TabId = "location" | "about" | "services" | "contact" | "merch" | null;

const TAB_IDS: Exclude<TabId, null>[] = [
  "location",
  "about",
  "services",
  "contact",
  "merch",
];

type HomeClientProps = {
  content: SiteContent;
};

export function HomeClient({ content }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>(null);
  const visibleIds = useMemo(
    () => new Set(getVisibleTabs(content).map((tab) => tab.id)),
    [content],
  );

  const openTab = (tab: TabId) => {
    if (tab && !visibleIds.has(tab)) return;
    setActiveTab(tab);
  };
  const closeTab = () => setActiveTab(null);

  useEffect(() => {
    const allowed = new Set(getVisibleTabs(content).map((tab) => tab.id));
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "bnr-open-tab" && typeof data.tab === "string") {
        if (
          TAB_IDS.includes(data.tab as Exclude<TabId, null>) &&
          allowed.has(data.tab as Exclude<TabId, null>)
        ) {
          setActiveTab(data.tab as TabId);
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [content]);

  useEffect(() => {
    try {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (
        tab &&
        TAB_IDS.includes(tab as Exclude<TabId, null>) &&
        visibleIds.has(tab as Exclude<TabId, null>)
      ) {
        setActiveTab(tab as TabId);
      }
    } catch {
      /* ignore */
    }
  }, [visibleIds]);

  // Phones: pin height once so Safari URL-bar show/hide cannot resize the game.
  // Desktop: follow the window so dragging the browser bigger/smaller fills the hole.
  useEffect(() => {
    const root = document.documentElement;
    const pin = () => {
      const h = Math.round(window.innerHeight);
      if (h > 0) root.style.setProperty("--bnr-app-height", `${h}px`);
    };
    pin();
    window.addEventListener("orientationchange", pin);
    if (isPhoneLike()) {
      return () => window.removeEventListener("orientationchange", pin);
    }
    window.addEventListener("resize", pin);
    return () => {
      window.removeEventListener("orientationchange", pin);
      window.removeEventListener("resize", pin);
    };
  }, []);

  useEffect(() => {
    if (!activeTab) return;
    document.getElementById("unity-canvas")?.blur();
  }, [activeTab]);

  return (
    <main className="relative flex h-[var(--bnr-app-height,100dvh)] flex-col overflow-hidden bg-[#0a1620]">
      <Header
        businessName={content.businessName}
        subheader={content.subheader}
        home
      />

      {/* Fills the space between header and tabs. Unity canvas is sized to this box. */}
      <div
        className={`game-frame relative mx-auto min-h-0 w-full flex-1 overflow-hidden ${
          activeTab ? "pointer-events-none" : ""
        }`}
      >
        <UnityGame />
      </div>

      <BottomTabs content={content} activeTab={activeTab} onSelect={openTab} />

      {visibleIds.has("location") ? (
        <ScorecardPopup
          isOpen={activeTab === "location"}
          onClose={closeTab}
          title={content.location.title}
          pageHref="/location"
        >
          <LocationPopup
            content={content.location}
            phone={content.contact.phone}
            email={content.contact.email}
          />
        </ScorecardPopup>
      ) : null}

      {visibleIds.has("about") ? (
        <ScorecardPopup
          isOpen={activeTab === "about"}
          onClose={closeTab}
          title={content.about.title}
          pageHref="/about"
        >
          <AboutPopup content={content.about} />
        </ScorecardPopup>
      ) : null}

      {visibleIds.has("services") ? (
        <ScorecardPopup
          isOpen={activeTab === "services"}
          onClose={closeTab}
          title={servicesTitle(content)}
          pageHref="/services"
        >
          <ServicesPopup
            services={content.services}
            intro={content.servicesPage.intro}
            contactLabel={contactTitle(content)}
            onContact={visibleIds.has("contact") ? () => openTab("contact") : undefined}
          />
        </ScorecardPopup>
      ) : null}

      {visibleIds.has("contact") ? (
        <ScorecardPopup
          isOpen={activeTab === "contact"}
          onClose={closeTab}
          title={contactTitle(content)}
          pageHref="/contact"
        >
          <ContactPopup contact={content.contact} />
        </ScorecardPopup>
      ) : null}

      {visibleIds.has("merch") ? (
        <ScorecardPopup
          isOpen={activeTab === "merch"}
          onClose={closeTab}
          title={content.merch.headline}
          pageHref="/merch"
        >
          <MerchPopup merch={content.merch} />
        </ScorecardPopup>
      ) : null}
    </main>
  );
}
