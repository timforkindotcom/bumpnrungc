"use client";

import type { SiteContent } from "@/lib/content";
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
import { useEffect, useState } from "react";

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

  const openTab = (tab: TabId) => setActiveTab(tab);
  const closeTab = () => setActiveTab(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "bnr-open-tab" && typeof data.tab === "string") {
        if (TAB_IDS.includes(data.tab as Exclude<TabId, null>)) {
          setActiveTab(data.tab as TabId);
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    try {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (tab && TAB_IDS.includes(tab as Exclude<TabId, null>)) {
        setActiveTab(tab as TabId);
      }
    } catch {
      /* ignore */
    }
  }, []);

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

      <BottomTabs activeTab={activeTab} onSelect={openTab} />

      <ScorecardPopup
        isOpen={activeTab === "location"}
        onClose={closeTab}
        title={`${content.location.title} — Brighton, MI`}
        pageHref="/location"
      >
        <LocationPopup
          content={content.location}
          phone={content.contact.phone}
          email={content.contact.email}
        />
      </ScorecardPopup>

      <ScorecardPopup
        isOpen={activeTab === "about"}
        onClose={closeTab}
        title={content.about.title}
        pageHref="/about"
      >
        <AboutPopup content={content.about} />
      </ScorecardPopup>

      <ScorecardPopup
        isOpen={activeTab === "services"}
        onClose={closeTab}
        title="Services"
        pageHref="/services"
      >
        <ServicesPopup services={content.services} onContact={() => openTab("contact")} />
      </ScorecardPopup>

      <ScorecardPopup
        isOpen={activeTab === "contact"}
        onClose={closeTab}
        title="Contact"
        pageHref="/contact"
      >
        <ContactPopup contact={content.contact} />
      </ScorecardPopup>

      <ScorecardPopup
        isOpen={activeTab === "merch"}
        onClose={closeTab}
        title={content.merch.headline}
        pageHref="/merch"
      >
        <MerchPopup merch={content.merch} />
      </ScorecardPopup>
    </main>
  );
}
