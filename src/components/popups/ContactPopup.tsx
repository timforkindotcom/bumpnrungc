"use client";

import { FormEvent, useState } from "react";
import { NotepadBlank, NotepadParagraph, NotepadRow } from "@/components/NotepadLines";

type ContactPopupProps = {
  contact: {
    intro: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
  };
};

export function ContactPopup({ contact }: ContactPopupProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          _gotcha: formData.get("_gotcha"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      setStatus("success");
      setMessage("Message sent — we'll be in touch.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again or call us directly.");
    }
  }

  return (
    <div className="notepad-block">
      <NotepadParagraph text={contact.intro} />

      {(contact.phone || contact.email) && (
        <>
          {contact.phone ? (
            <NotepadRow>
              Phone:{" "}
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="underline">
                {contact.phone}
              </a>
            </NotepadRow>
          ) : null}
          {contact.email ? (
            <NotepadRow>
              Email:{" "}
              <a href={`mailto:${contact.email}`} className="underline">
                {contact.email}
              </a>
            </NotepadRow>
          ) : null}
          <NotepadBlank />
        </>
      )}

      <form onSubmit={handleSubmit} className="notepad-block space-y-1 pt-1">
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
        <NotepadRow className="font-label text-xs uppercase tracking-[0.14em] text-ink-muted">
          Name
        </NotepadRow>
        <input required name="name" className="vintage-input w-full" placeholder="Your name" />
        <NotepadRow className="font-label text-xs uppercase tracking-[0.14em] text-ink-muted">
          Email
        </NotepadRow>
        <input required type="email" name="email" className="vintage-input w-full" placeholder="you@email.com" />
        <NotepadRow className="font-label text-xs uppercase tracking-[0.14em] text-ink-muted">
          Phone
        </NotepadRow>
        <input name="phone" className="vintage-input w-full" placeholder="Optional" />
        <NotepadRow className="font-label text-xs uppercase tracking-[0.14em] text-ink-muted">
          Message
        </NotepadRow>
        <textarea
          required
          name="message"
          rows={4}
          className="vintage-input w-full resize-none"
          placeholder="What do you need fixed?"
        />
        <NotepadBlank />
        <button
          type="submit"
          disabled={status === "loading"}
          className="font-label w-full bg-fairway px-4 py-2 text-xs uppercase tracking-[0.18em] text-cream transition hover:bg-fairway-light disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>

      {message && (
        <NotepadRow className={status === "success" ? "text-fairway" : "text-red-800"}>
          {message}
        </NotepadRow>
      )}

      {(contact.instagram || contact.facebook) && (
        <>
          <NotepadBlank />
          <div className="flex gap-4 text-sm text-ink">
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="underline">
                Instagram
              </a>
            )}
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="underline">
                Facebook
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
