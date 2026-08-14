import Link from "next/link";
import { Header } from "@/components/Header";
import { SITE_TABS } from "@/lib/nav";
import type { SiteContent } from "@/lib/content";
import type { ReactNode } from "react";

type ContentShellProps = {
  content: SiteContent;
  title: string;
  activeHref: string;
  children: ReactNode;
};

export function ContentShell({
  content,
  title,
  activeHref,
  children,
}: ContentShellProps) {
  return (
    <div className="site-shell flex min-h-full flex-col">
      <Header businessName={content.businessName} subheader={content.subheader} />

      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <article className="scorecard-texture overflow-hidden rounded-[2px] border border-fairway/35">
          <div className="header-plate border-b border-fairway/40 px-4 py-3.5 text-center">
            <h1 className="font-label text-sm uppercase tracking-[0.2em] text-cream">
              {title}
            </h1>
          </div>
          <div className="notepad-block px-5 py-4 text-ink">{children}</div>
        </article>
        <p className="mt-5 text-center">
          <Link
            href="/"
            className="font-label text-xs uppercase tracking-[0.18em] text-cream/70 hover:text-cream"
          >
            Play the hole
          </Link>
        </p>
      </div>

      <nav
        aria-label="Site"
        className="relative z-20 border-t border-white/10 bg-forest px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1">
          {SITE_TABS.map((tab) => {
            const isActive = activeHref === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`font-label rounded-sm px-1.5 py-2 text-center text-[9px] uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.16em] ${
                  isActive
                    ? "bg-cream/15 text-cream"
                    : "text-cream/55 hover:bg-white/5 hover:text-cream"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <footer className="bg-forest px-4 pb-5 pt-1 text-center">
        <Link
          href="/privacy"
          className="font-label text-[10px] uppercase tracking-[0.16em] text-cream/45 hover:text-cream/80"
        >
          Privacy
        </Link>
      </footer>
    </div>
  );
}
