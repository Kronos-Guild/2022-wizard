import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "2022 Wizard - Token-2022 Anchor Program Generator";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #2a2a2a 0%, #1a1a1a 100%)",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: 0.9,
            }}
          >
            <span
              style={{
                fontSize: 140,
                fontWeight: 700,
                color: "#f5f5f5",
                letterSpacing: "-0.05em",
              }}
            >
              2022
            </span>
            <span
              style={{
                fontSize: 140,
                fontWeight: 700,
                background: "linear-gradient(135deg, #c44d3a, #d4614e)",
                backgroundClip: "text",
                color: "transparent",
                letterSpacing: "-0.05em",
              }}
            >
              Wizard
            </span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: "16px",
            }}
          >
            Anchor Program Generator
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.4)",
              maxWidth: "600px",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            Generate secure, production-ready Token-2022 programs from audited
            building blocks
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "rgba(255,255,255,0.4)",
            fontSize: 18,
          }}
        >
          <span>by Kronos Guild</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
