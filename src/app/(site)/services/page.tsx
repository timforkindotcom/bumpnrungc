import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/getSiteContent";
import { contactTitle, hasContact, hasServices, servicesTitle } from "@/lib/content";
import { sanityPageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { ServicesPopup } from "@/components/popups/ServicesPopup";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return sanityPageMetadata(
    content,
    servicesTitle(content),
    content.servicesPage.intro,
    "/services",
  );
}

export default async function ServicesPage() {
  const content = await getSiteContent();
  if (!hasServices(content)) notFound();

  return (
    <ContentShell
      content={content}
      title={servicesTitle(content)}
      activeHref="/services"
    >
      <ServicesPopup
        services={content.services}
        intro={content.servicesPage.intro}
        contactLabel={hasContact(content) ? contactTitle(content) : undefined}
        contactHref={hasContact(content) ? "/contact" : undefined}
      />
    </ContentShell>
  );
}
