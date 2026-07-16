import { ImageResponse } from "next/og";

export const alt =
  "aidatasucks.com - which AI vendors let you track what you spend?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          padding: 80,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(239, 68, 68, 0.12)",
              color: "#f87171",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            ai
          </div>
          <div
            style={{
              display: "flex",
              color: "#fafaf9",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            <span>aidatasucks</span>
            <span style={{ color: "#71717a" }}>.com</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#fafaf9",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          <span>Which AI vendors actually</span>
          <span style={{ color: "#71717a" }}>let you track what you spend?</span>
        </div>

        <div style={{ color: "#71717a", fontSize: 28 }}>
          Cost APIs, usage endpoints, and billing exports, graded.
        </div>
      </div>
    ),
    { ...size },
  );
}
