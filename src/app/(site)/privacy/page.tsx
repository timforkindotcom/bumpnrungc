import type { Metadata } from "next";
import { getSiteContent } from "@/lib/getSiteContent";
import { pageMetadata } from "@/lib/site";
import { ContentShell } from "@/components/ContentShell";
import { NotepadParagraph, NotepadRow } from "@/components/NotepadLines";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Privacy",
    description:
      "How Bump N Run Golf Club uses the contact form, analytics, and fonts on this site.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const content = await getSiteContent();
  return (
    <ContentShell content={content} title="Privacy" activeHref="/privacy">
      <NotepadParagraph text="Bump N Run Golf Club is a small mobile golf repair business in Brighton, Michigan. This page is a plain-English note about what this website collects." />
      <NotepadRow className="font-label text-xs uppercase tracking-[0.14em] text-fairway">
        Contact form
      </NotepadRow>
      <NotepadParagraph text="If you send a message, we get your name, email, optional phone number, and what you wrote. That goes to a Google Sheet we control and an email to bumpnrungc@gmail.com so we can reply. We do not sell this. We do not use it for ads. If you want it deleted, email bumpnrungc@gmail.com or use the contact form and say so." />
      <NotepadRow className="font-label text-xs uppercase tracking-[0.14em] text-fairway">
        Analytics
      </NotepadRow>
      <NotepadParagraph text="When the live site is connected to Google Analytics, Google may record that a page was opened (for example, which page and roughly where in the world). We use that to see if the site is working. We do not run ads or remarketing from this site." />
      <NotepadRow className="font-label text-xs uppercase tracking-[0.14em] text-fairway">
        Fonts and the game
      </NotepadRow>
      <NotepadParagraph text="The site loads fonts from Adobe Fonts. The homepage golf hole runs in your browser. Playing the hole does not create an account and does not ask for your name." />
      <NotepadParagraph text="Questions about this page? Use Contact and we'll answer." />
    </ContentShell>
  );
}
