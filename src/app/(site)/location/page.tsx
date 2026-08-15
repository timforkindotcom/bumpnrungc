import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/getSiteContent";
import { hasLocation } from "@/lib/content";
import { sanityPageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { LocationPopup } from "@/components/popups/LocationPopup";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return sanityPageMetadata(
    content,
    content.location.title,
    content.location.body,
    "/location",
  );
}

export default async function LocationPage() {
  const content = await getSiteContent();
  if (!hasLocation(content)) notFound();

  return (
    <ContentShell
      content={content}
      title={content.location.title}
      activeHref="/location"
    >
      <LocationPopup
        content={content.location}
        phone={content.contact.phone}
        email={content.contact.email}
      />
    </ContentShell>
  );
}
