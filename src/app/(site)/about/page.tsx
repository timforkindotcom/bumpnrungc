import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/getSiteContent";
import { hasAbout } from "@/lib/content";
import { sanityPageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { AboutPopup } from "@/components/popups/AboutPopup";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return sanityPageMetadata(
    content,
    content.about.title,
    content.about.body,
    "/about",
  );
}

export default async function AboutPage() {
  const content = await getSiteContent();
  if (!hasAbout(content)) notFound();

  return (
    <ContentShell content={content} title={content.about.title} activeHref="/about">
      <AboutPopup content={content.about} />
    </ContentShell>
  );
}
