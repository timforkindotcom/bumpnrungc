import Link from "next/link";
import { getSiteContent } from "@/lib/getSiteContent";
import { hasText } from "@/lib/content";
import { getVisibleTabs } from "@/lib/nav";

export default async function NotFound() {
  const content = await getSiteContent();
  const tabs = getVisibleTabs(content);

  return (
    <div className="site-shell flex min-h-full flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display mt-3 text-4xl text-cream">Page not found</h1>
      <p className="font-body mt-4 max-w-sm text-lg text-cream/75">
        That page isn&apos;t here.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="font-label text-xs uppercase tracking-[0.18em] text-gold hover:text-cream"
        >
          Home
        </Link>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className="font-label text-xs uppercase tracking-[0.18em] text-cream/70 hover:text-cream"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {hasText(content.businessName) ? (
        <p className="font-label mt-10 text-[11px] uppercase text-cream/45">
          {content.businessName}
        </p>
      ) : null}
    </div>
  );
}
