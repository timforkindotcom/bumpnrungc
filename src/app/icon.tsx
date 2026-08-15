import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/getSiteContent";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Icon() {
  const content = await getSiteContent();
  const letter = content.businessName.trim().charAt(0);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a3d2c",
          color: "#f5f8f4",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {letter}
      </div>
    ),
    { ...size },
  );
}
