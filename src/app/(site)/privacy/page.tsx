import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/getSiteContent";
import { hasPrivacy } from "@/lib/content";
import { sanityPageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { NotepadParagraph } from "@/components/NotepadLines";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return sanityPageMetadata(
    content,
    content.privacy.title,
    content.privacy.body,
    "/privacy",
  );
}

export default async function PrivacyPage() {
  const content = await getSiteContent();
  if (!hasPrivacy(content)) notFound();

  return (
    <ContentShell
      content={content}
      title={content.privacy.title}
      activeHref="/privacy"
    >
      <NotepadParagraph text={content.privacy.body} />
    </ContentShell>
  );
}
