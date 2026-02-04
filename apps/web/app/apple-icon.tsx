import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: "#1a1a1a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 32,
        }}
      >
        <span
          style={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #c44d3a, #d4614e)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          22
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
