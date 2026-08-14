import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, _gotcha } = body;

    // Honeypot — bots fill this; humans never see it
    if (_gotcha) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (scriptUrl) {
      const payload: Record<string, string> = {
        name: String(name),
        email: String(email),
        phone: phone ? String(phone) : "",
        message: String(message),
      };
      if (secret) payload.secret = secret;

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error("Google Apps Script failed:", response.status, text);
        throw new Error("Google Script failed");
      }

      return NextResponse.json({ ok: true });
    }

    // Dev fallback when GOOGLE_SCRIPT_URL is not set
    console.log("Contact form submission (dev):", { name, email, phone, message });
    return NextResponse.json({ ok: true, dev: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
