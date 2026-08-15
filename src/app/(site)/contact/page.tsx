import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/getSiteContent";
import { contactTitle, hasContact } from "@/lib/content";
import { sanityPageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { ContactPopup } from "@/components/popups/ContactPopup";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return sanityPageMetadata(
    content,
    contactTitle(content),
    content.contact.intro,
    "/contact",
  );
}

export default async function ContactPage() {
  const content = await getSiteContent();
  if (!hasContact(content)) notFound();

  return (
    <ContentShell
      content={content}
      title={contactTitle(content)}
      activeHref="/contact"
    >
      <ContactPopup contact={content.contact} />
    </ContentShell>
  );
}
