import { NotepadBlank, NotepadParagraph, NotepadRow } from "@/components/NotepadLines";

type LocationPopupProps = {
  content: {
    title: string;
    body: string;
    serviceArea: string;
  };
  phone?: string;
  email?: string;
};

export function LocationPopup({ content, phone, email }: LocationPopupProps) {
  return (
    <div className="notepad-block">
      <NotepadParagraph text={content.body} />
      <NotepadRow className="italic text-ink-muted">{content.serviceArea}</NotepadRow>
      {(phone || email) && (
        <>
          <NotepadBlank />
          {phone ? (
            <NotepadRow>
              Phone:{" "}
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="underline">
                {phone}
              </a>
            </NotepadRow>
          ) : null}
          {email ? (
            <NotepadRow>
              Email:{" "}
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
            </NotepadRow>
          ) : null}
        </>
      )}
      <NotepadBlank />
      <NotepadRow className="font-label text-xs uppercase tracking-[0.16em] text-ink-muted">
        Mobile trailer · Brighton, MI · and beyond
      </NotepadRow>
    </div>
  );
}
