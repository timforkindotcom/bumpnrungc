import type { Metadata } from "next";
import { getSiteContent } from "@/lib/getSiteContent";
import { pageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { ServicesPopup } from "@/components/popups/ServicesPopup";
import { NotepadParagraph } from "@/components/NotepadLines";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Golf Club Repair in Brighton, MI",
    description:
      "Mobile golf club repair and regripping in Brighton, Michigan and Southeast Michigan. Lofts, lies, grips, and on-site service at your course, range, or driveway.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const content = await getSiteContent();
  return (
    <ContentShell content={content} title="Services" activeHref="/services">
      <NotepadParagraph text="Need golf club repair in Brighton, MI or nearby? Bump N Run brings the shop to you. We fix lofts and lies, replace grips, and keep your set in spec at the course, the range, or your driveway." />
      <ServicesPopup services={content.services} contactHref="/contact" />
    </ContentShell>
  );
}
