import Link from "next/link";
import { NotepadBlank, NotepadParagraph, NotepadRow } from "@/components/NotepadLines";
import type { ServiceItem } from "@/lib/content";

const contactClass =
  "font-label mt-1 w-full border border-fairway/40 bg-fairway/10 px-4 py-2 text-center text-xs uppercase tracking-[0.18em] text-fairway transition hover:bg-fairway/20";

type ServicesPopupProps = {
  services: ServiceItem[];
  onContact?: () => void;
  contactHref?: string;
};

export function ServicesPopup({
  services,
  onContact,
  contactHref,
}: ServicesPopupProps) {
  return (
    <div className="notepad-block">
      {services.map((service, index) => (
        <div key={service.title} className="notepad-block">
          <NotepadRow className="font-label uppercase tracking-[0.08em] text-fairway">
            {index + 1}. {service.title}
          </NotepadRow>
          <NotepadParagraph text={service.description} />
        </div>
      ))}
      <NotepadBlank />
      {contactHref ? (
        <Link href={contactHref} className={`${contactClass} block`}>
          Contact Us
        </Link>
      ) : (
        <button type="button" onClick={onContact} className={contactClass}>
          Contact Us
        </button>
      )}
    </div>
  );
}
