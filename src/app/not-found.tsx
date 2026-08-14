import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-shell flex min-h-full flex-col items-center justify-center px-6 text-center">
      <p className="font-label text-xs uppercase tracking-[0.2em] text-cream/60">
        Hole not found
      </p>
      <h1 className="font-display mt-3 text-4xl text-cream">Wrong fairway.</h1>
      <p className="font-body mt-4 max-w-sm text-sm text-cream/75">
        That page isn&apos;t here. Head back to the hole, or check Services if you
        need golf club repair in Brighton, MI.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="font-label text-xs uppercase tracking-[0.18em] text-gold hover:text-cream"
        >
          Play the hole
        </Link>
        <Link
          href="/services"
          className="font-label text-xs uppercase tracking-[0.18em] text-cream/70 hover:text-cream"
        >
          Services
        </Link>
        <Link
          href="/contact"
          className="font-label text-xs uppercase tracking-[0.18em] text-cream/70 hover:text-cream"
        >
          Book Services
        </Link>
      </div>
    </div>
  );
}
