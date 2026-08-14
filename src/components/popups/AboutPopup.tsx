import { NotepadParagraph, NotepadRow } from "@/components/NotepadLines";

type AboutPopupProps = {
  content: {
    title: string;
    body: string;
    closer: string;
  };
};

export function AboutPopup({ content }: AboutPopupProps) {
  return (
    <div className="notepad-block">
      <NotepadParagraph text={content.body} />
      {content.closer ? (
        <NotepadRow className="italic text-ink-muted">{content.closer}</NotepadRow>
      ) : null}
    </div>
  );
}
