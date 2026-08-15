import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/getSiteContent";
import { hasMerch } from "@/lib/content";
import { sanityPageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { MerchPopup } from "@/components/popups/MerchPopup";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return sanityPageMetadata(
    content,
    content.merch.headline,
    content.merch.body,
    "/merch",
  );
}

export default async function MerchPage() {
  const content = await getSiteContent();
  if (!hasMerch(content)) notFound();

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
