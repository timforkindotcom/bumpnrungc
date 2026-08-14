import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSiteContent } from "@/lib/getSiteContent";
import { getSiteUrl, localBusinessJsonLd } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: content.seoTitle,
      template: "%s | Bump N Run Golf Club",
    },
    description: content.seoDescription,
    applicationName: content.businessName,
    authors: [{ name: content.businessName }],
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: content.businessName,
      title: content.seoTitle,
      description: content.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle,
      description: content.seoDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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

  return (
    <html lang="en" className="h-full">
      <head>
        {/* Spirits + Spaghetti Western (Adobe Fonts / Typekit) */}
        <link rel="stylesheet" href="https://use.typekit.net/nma7fmi.css" />
      </head>
      <body className="h-full antialiased font-body">
        <Script src="/bnr-keyboard.js" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
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
