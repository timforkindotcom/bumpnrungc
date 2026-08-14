import type { Metadata } from "next";
import { getSiteContent } from "@/lib/getSiteContent";
import { pageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { AboutPopup } from "@/components/popups/AboutPopup";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "About Bump N Run",
    description:
      "Bump N Run Golf Club is a mobile golf repair trailer in Brighton, MI. We come to you for regrips, repairs, and tune-ups across Southeast Michigan.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const content = await getSiteContent();
  return (
    <ContentShell content={content} title={content.about.title} activeHref="/about">
      <AboutPopup content={content.about} />
    </ContentShell>
  );
}
