import Link from "next/link";
import { hasText } from "@/lib/content";

type HeaderProps = {
  businessName: string;
  subheader: string;
  /** Home page: this is the main heading. Other pages link back to the hole. */
  home?: boolean;
};

export function Header({ businessName, subheader, home = false }: HeaderProps) {
  if (!hasText(businessName) && !hasText(subheader)) return null;

  const nameClass =
    "font-display whitespace-nowrap text-[1.85rem] leading-none tracking-[0.02em] text-cream sm:text-[3rem]";

  return (
    <header className="header-plate relative z-10 shrink-0 border-b border-white/10 px-3 py-3 text-center sm:py-3.5">
      {hasText(businessName) ? (
        home ? (
          <h1 className={nameClass}>{businessName}</h1>
        ) : (
          <p className={nameClass}>
            <Link href="/" className="hover:text-gold">
              {businessName}
            </Link>
          </p>
        )
      ) : null}
      {hasText(subheader) ? (
        <p className="font-display mt-2 whitespace-nowrap text-base leading-none text-cream/75 sm:text-2xl">
          {subheader}
        </p>
      ) : null}
    </header>
  );
}
