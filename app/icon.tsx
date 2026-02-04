import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 14,
          background: "#1a1a1a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
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
