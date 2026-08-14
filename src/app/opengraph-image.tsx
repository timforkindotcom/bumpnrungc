import { ImageResponse } from "next/og";

export const alt = "Bump N Run Golf Club — mobile golf club repair in Brighton, MI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            color: "#c4a35a",
          }}
        >
          MI MOBILE GOLF REPAIR TRAILER
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            lineHeight: 1.1,
            marginTop: 20,
          }}
        >
          Bump N Run Golf Club
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#c4a35a",
            marginTop: 22,
          }}
        >
          It's The Club's Fault.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            marginTop: 40,
            color: "#f5f8f4",
          }}
        >
          Golf club repair · Brighton, MI
        </div>
      </div>
    ),
    { ...size },
  );
}
