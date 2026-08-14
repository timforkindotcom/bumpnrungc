import type { ReactNode } from "react";

/**
 * Paragraph with ruled lines that scroll and wrap with the text
 * (background-attachment: local + matching line-height).
 */
export function NotepadParagraph({ text }: { text: string }) {
  const blocks = text.split(/\n+/).filter((b) => b.trim().length > 0);
  return (
    <div className="notepad-block space-y-0">
      {blocks.map((block, bi) => (
        <p
          key={bi}
          className="notepad-paragraph mb-2 text-sm text-ink"
        >
          {block}
        </p>
      ))}
    </div>
  );
}

export function NotepadRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`notepad-line text-sm ${className}`.trim()}>{children}</div>;
}

export function NotepadBlank({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="notepad-line-blank" aria-hidden />
      ))}
    </>
  );
}
