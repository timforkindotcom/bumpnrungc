/**
 * Bump N Run — Contact form → Google Sheet + email
 *
 * Setup:
 * 1. Create a Google Sheet. Name the first tab "Leads" (or change SHEET_NAME).
 * 2. Extensions → Apps Script. Paste this file. Set NOTIFY_EMAIL below.
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web app URL into .env.local as GOOGLE_SCRIPT_URL=
 * 5. Optional: set SECRET here and GOOGLE_SCRIPT_SECRET in .env.local
 *
 * Sheet columns (row 1 headers): Timestamp | Name | Email | Phone | Message
 */

const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = "bumpnrungc@gmail.com";
const SECRET = ""; // optional shared secret; leave "" to disable

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    if (SECRET && data.secret !== SECRET) {
      return jsonOut({ ok: false, error: "unauthorized" });
    }

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const message = String(data.message || "").trim();

    if (!name || !email || !message) {
      return jsonOut({ ok: false, error: "missing fields" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Message"]);
    }

    sheet.appendRow([new Date(), name, email, phone, message]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "Bump N Run contact: " + name,
      replyTo: email,
      body:
        "New contact form submission\n\n" +
        "Name: " +
        name +
        "\nEmail: " +
        email +
        "\nPhone: " +
        (phone || "(none)") +
        "\n\nMessage:\n" +
        message +
        "\n",
    });

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Optional: open the web app URL in a browser to confirm deploy. */
function doGet() {
  return ContentService.createTextOutput("Bump N Run contact endpoint OK");
}
