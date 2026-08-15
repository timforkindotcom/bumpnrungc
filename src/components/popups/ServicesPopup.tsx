import Link from "next/link";
import { NotepadBlank, NotepadParagraph, NotepadRow } from "@/components/NotepadLines";
import { hasText, type ServiceItem } from "@/lib/content";

const contactClass =
  "font-label mt-1 w-full border border-fairway/40 bg-fairway/10 px-4 py-2 text-center text-xs uppercase tracking-[0.18em] text-fairway transition hover:bg-fairway/20";

type ServicesPopupProps = {
  services: ServiceItem[];
  intro?: string;
  contactLabel?: string;
  onContact?: () => void;
  contactHref?: string;
};

export function ServicesPopup({
  services,
  intro,
  contactLabel,
  onContact,
  contactHref,
}: ServicesPopupProps) {
  const showContact = hasText(contactLabel) && Boolean(onContact || contactHref);

  return (
    <div className="notepad-block">
      {hasText(intro) ? <NotepadParagraph text={intro ?? ""} /> : null}
      {services.map((service, index) => (
        <div key={service.title || index} className="notepad-block">
          {hasText(service.title) ? (
            <NotepadRow className="font-label font-bold uppercase text-fairway underline underline-offset-4">
              {index + 1}. {service.title}
            </NotepadRow>
          ) : null}
          <NotepadParagraph text={service.description} />
        </div>
      ))}
      {showContact ? (
        <>
          <NotepadBlank />
          {contactHref ? (
            <Link href={contactHref} className={`${contactClass} block`}>
              {contactLabel}
            </Link>
          ) : (
            <button type="button" onClick={onContact} className={contactClass}>
              {contactLabel}
            </button>
          )}
        </>
      ) : null}
    </div>
  );
}
