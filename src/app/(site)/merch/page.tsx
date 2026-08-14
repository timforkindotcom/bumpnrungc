import type { Metadata } from "next";
import { getSiteContent } from "@/lib/getSiteContent";
import { pageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { MerchPopup } from "@/components/popups/MerchPopup";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Merch",
    description: "Bump N Run gear is on the way — vintage golf vibes, mobile shop pride.",
    path: "/merch",
  });
}

export default async function MerchPage() {
  const content = await getSiteContent();
  return (
    <ContentShell
      content={content}
      title={content.merch.headline}
      activeHref="/merch"
    >
      <MerchPopup merch={content.merch} />
    </ContentShell>
  );
}
