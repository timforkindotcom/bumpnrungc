import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { hasText } from "@/lib/content";
import { getSiteContent } from "@/lib/getSiteContent";
import { getSiteUrl, localBusinessJsonLd, shareImages } from "@/lib/site";

const MOBILE_UA =
  /iPhone|iPad|iPod|Android|Mobile|FBAN|FBAV|Instagram|CriOS|FxiOS|EdgiOS/i;

/** Pull fresh Sanity copy on each visit so Publish shows right away. */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const defaultTitle = content.seoTitle || content.businessName;
  const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    robots: {
      index: true,
      follow: true,
    },
  };

  if (hasText(defaultTitle)) {
    metadata.title = hasText(content.businessName)
      ? { default: defaultTitle, template: `%s | ${content.businessName}` }
      : defaultTitle;
  }
  if (hasText(content.seoDescription)) {
    metadata.description = content.seoDescription;
  }
  if (hasText(content.businessName)) {
    metadata.applicationName = content.businessName;
    metadata.authors = [{ name: content.businessName }];
  }

  metadata.openGraph = {
    type: "website",
    locale: "en_US",
    images: shareImages(),
    ...(hasText(content.businessName) ? { siteName: content.businessName } : {}),
    ...(hasText(content.seoTitle) ? { title: content.seoTitle } : {}),
    ...(hasText(content.seoDescription)
      ? { description: content.seoDescription }
      : {}),
  };
  metadata.twitter = {
    card: "summary_large_image",
    images: ["/og.png"],
    ...(hasText(content.seoTitle) ? { title: content.seoTitle } : {}),
    ...(hasText(content.seoDescription)
      ? { description: content.seoDescription }
      : {}),
  };

  return metadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const jsonLd = localBusinessJsonLd(content);
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const loadGa =
    Boolean(gaId) &&
    process.env.NODE_ENV === "production" &&
    /^G-[A-Z0-9]+$/i.test(gaId ?? "");
  const ua = (await headers()).get("user-agent") ?? "";
  const isMobile = MOBILE_UA.test(ua);

  return (
    <html lang="en" className="h-full">
      <head>
        {/* Skip Adobe fonts on phones — extra files can stall a weak browser. */}
        {isMobile ? null : (
          <link rel="stylesheet" href="https://use.typekit.net/nma7fmi.css" />
        )}
      </head>
      <body className="h-full antialiased font-body">
        {isMobile ? null : (
          <Script src="/bnr-keyboard.js" strategy="beforeInteractive" />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        {loadGa ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
