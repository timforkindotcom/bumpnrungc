import type { Metadata } from "next";
import { getSiteContent } from "@/lib/getSiteContent";
import { HomeClient } from "@/components/HomeClient";
import { getSiteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: { absolute: content.seoTitle },
    description: content.seoDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      url: getSiteUrl(),
      type: "website",
    },
  };
}

export default async function HomePage() {
  const content = await getSiteContent();
  return <HomeClient content={content} />;
}
