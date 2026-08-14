import type { Metadata } from "next";
import { getSiteContent } from "@/lib/getSiteContent";
import { pageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { LocationPopup } from "@/components/popups/LocationPopup";
import { NotepadParagraph } from "@/components/NotepadLines";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Mobile Golf Repair in Brighton, MI",
    description:
      "Bump N Run is based in Brighton, Michigan. Our mobile golf club repair trailer serves Livingston County, Washtenaw County, and Southeast Michigan.",
    path: "/location",
  });
}

export default async function LocationPage() {
  const content = await getSiteContent();
  return (
    <ContentShell
      content={content}
      title={`${content.location.title} — Brighton, MI`}
      activeHref="/location"
    >
      <NotepadParagraph text="Looking for golf club repair near Brighton, Michigan? We don't wait for you to find a shop — the trailer comes to your course, range, tournament, or driveway." />
      <LocationPopup
        content={content.location}
        phone={content.contact.phone}
        email={content.contact.email}
      />
    </ContentShell>
  );
}
