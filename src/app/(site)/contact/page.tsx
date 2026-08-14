import type { Metadata } from "next";
import { getSiteContent } from "@/lib/getSiteContent";
import { pageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { ContactPopup } from "@/components/popups/ContactPopup";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Contact Bump N Run",
    description:
      "Book mobile golf club repair or regripping in Brighton, MI and Southeast Michigan. Send a note — we'll come to you.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const content = await getSiteContent();
  return (
    <ContentShell content={content} title="Contact" activeHref="/contact">
      <ContactPopup contact={content.contact} />
    </ContentShell>
  );
}
