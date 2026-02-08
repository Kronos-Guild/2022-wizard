import { generateOgImage, ogAlt, ogSize, ogContentType } from "./og-image";

export const runtime = "edge";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage();
}
