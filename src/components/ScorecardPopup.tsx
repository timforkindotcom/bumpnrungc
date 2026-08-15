"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

type ScorecardPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pageHref?: string;
  children: ReactNode;
};

export function ScorecardPopup({
  isOpen,
  onClose,
  title,
  pageHref,
  children,
}: ScorecardPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close scorecard"
            className="fixed inset-0 z-30 bg-forest/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="scorecard-texture fixed left-1/2 top-1/2 z-40 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-white/10 shadow-[0_24px_64px_rgba(10,61,44,0.45)]"
            onPointerDown={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <div className="header-plate border-b border-fairway/40 px-4 py-3.5 text-center">
              <p className="font-label text-sm uppercase tracking-[0.2em] text-cream">
                {title}
              </p>
            </div>
            <div className="notepad-block max-h-[min(58vh,520px)] overflow-y-auto px-5 py-5 text-ink">
              {children}
            </div>
            <div className="flex items-center justify-between border-t border-fairway/15 bg-parchment-light px-4 py-3">
              {pageHref ? (
                <Link
                  href={pageHref}
                  className="font-label text-xs uppercase tracking-[0.18em] text-fairway hover:text-ink"
                >
                  Open full page
                </Link>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={onClose}
                className="font-label text-xs uppercase tracking-[0.18em] text-ink hover:text-fairway"
              >
                Fold Away ×
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
