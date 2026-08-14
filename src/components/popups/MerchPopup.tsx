import { NotepadBlank, NotepadParagraph, NotepadRow } from "@/components/NotepadLines";

type MerchPopupProps = {
  merch: {
    headline: string;
    body: string;
    comingSoon: string;
  };
};

export function MerchPopup({ merch }: MerchPopupProps) {
  return (
    <div className="notepad-block text-center">
      <NotepadParagraph text={merch.body} />
      <NotepadBlank />
      <NotepadRow className="font-label text-center uppercase tracking-[0.2em] text-fairway">
        {merch.comingSoon}
      </NotepadRow>
    </div>
  );
}
