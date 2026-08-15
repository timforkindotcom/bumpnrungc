import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/getSiteContent";
import { hasText } from "@/lib/content";

export const alt = "";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function OpenGraphImage() {
  const content = await getSiteContent();
  const line1 = content.subheader;
  const line2 = content.businessName;
  const line3 = content.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a3d2c",
          color: "#f5f8f4",
          padding: "80px 88px",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 6,
            width: 160,
            background: "#c4a35a",
            marginBottom: 36,
          }}
        />
        {hasText(line1) ? (
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              color: "#c4a35a",
            }}
          >
            {line1}
          </div>
        ) : null}
        {hasText(line2) ? (
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.1,
              marginTop: 20,
            }}
          >
            {line2}
          </div>
        ) : null}
        {hasText(line3) ? (
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#c4a35a",
              marginTop: 22,
            }}
          >
            {line3}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
