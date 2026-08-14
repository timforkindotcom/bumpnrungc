import Link from "next/link";

type HeaderProps = {
  businessName: string;
  subheader: string;
  /** Home page: this is the main heading. Other pages link back to the hole. */
  home?: boolean;
};

export function Header({ businessName, subheader, home = false }: HeaderProps) {
  const nameClass =
    "font-display text-xl tracking-[0.02em] text-cream sm:text-2xl";

  return (
    <header className="header-plate relative z-10 shrink-0 border-b border-white/10 px-3 py-2 text-center sm:py-2.5">
      {home ? (
        <h1 className={nameClass}>{businessName}</h1>
      ) : (
        <p className={nameClass}>
          <Link href="/" className="hover:text-gold">
            {businessName}
          </Link>
        </p>
      )}
      <p className="font-label text-[9px] uppercase tracking-[0.22em] text-cream/75 sm:text-[10px]">
        {subheader}
      </p>
    </header>
  );
}
