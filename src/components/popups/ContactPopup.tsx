"use client";

import { FormEvent, useEffect, useState } from "react";
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

function isContactField(
  el: EventTarget | null,
): el is HTMLInputElement | HTMLTextAreaElement {
  return (
    (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
    el.classList.contains("vintage-input")
  );
}

function typeIntoField(
  el: HTMLInputElement | HTMLTextAreaElement,
  event: KeyboardEvent,
) {
  if (event.metaKey || event.ctrlKey || event.altKey) return false;
  if (el.disabled || el.readOnly) return false;

  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;

  if (event.key === "Backspace") {
    if (start !== end) {
      el.value = el.value.slice(0, start) + el.value.slice(end);
      el.setSelectionRange(start, start);
    } else if (start > 0) {
      el.value = el.value.slice(0, start - 1) + el.value.slice(start);
      el.setSelectionRange(start - 1, start - 1);
    }
    return true;
  }

  if (event.key === "Delete") {
    if (start !== end) {
      el.value = el.value.slice(0, start) + el.value.slice(end);
      el.setSelectionRange(start, start);
    } else {
      el.value = el.value.slice(0, start) + el.value.slice(start + 1);
      el.setSelectionRange(start, start);
    }
    return true;
  }

  if (event.key.length === 1) {
    el.value = el.value.slice(0, start) + event.key + el.value.slice(end);
    el.setSelectionRange(start + 1, start + 1);
    return true;
  }

  return false;
}

export function ContactPopup({ contact }: ContactPopupProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const first = document.querySelector<HTMLInputElement>("form .vintage-input");
    first?.focus();
  }, []);

  // If Unity already ate the key (preventDefault), type it into the field ourselves.
  useEffect(() => {
    const onKeyDown = (event: Event) => {
      const keyEvent = event as KeyboardEvent;
      if (!isContactField(keyEvent.target)) return;
      if (!keyEvent.defaultPrevented) return;
      if (!typeIntoField(keyEvent.target, keyEvent)) return;
      keyEvent.target.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const add =
      window.__bnrOrigAdd ?? EventTarget.prototype.addEventListener;
    const remove =
      window.__bnrOrigRemove ?? EventTarget.prototype.removeEventListener;
    add.call(window, "keydown", onKeyDown, true);
    return () => {
      remove.call(window, "keydown", onKeyDown, true);
    };
  }, []);

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
