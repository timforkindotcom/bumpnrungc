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
      {content.serviceArea ? (
        <NotepadRow className="italic text-ink-muted">{content.serviceArea}</NotepadRow>
      ) : null}
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
    </div>
  );
}
