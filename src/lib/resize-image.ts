/**
 * Client-side image normalisation for avatar uploads.
 *
 * The server does no image processing (see docs/05-architecture.md), so we
 * downscale to a square here before upload: this keeps the request body small,
 * enforces a predictable size, and drops any EXIF metadata via canvas re-encode.
 */

export const AVATAR_SIZE = 256;
export const MAX_SOURCE_BYTES = 15 * 1024 * 1024; // guard against loading huge files into memory
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export class ImageResizeError extends Error {}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // fall through to <img> decoding
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Reads `file`, center-crops it to a square and scales it to AVATAR_SIZE,
 * returning a WebP blob. Throws {@link ImageResizeError} on unsupported input.
 */
export async function resizeAvatar(file: File): Promise<Blob> {
  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    throw new ImageResizeError("unsupported-type");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new ImageResizeError("source-too-large");
  }

  const bitmap = await loadBitmap(file);
  const sourceWidth =
    bitmap instanceof HTMLImageElement ? bitmap.naturalWidth : bitmap.width;
  const sourceHeight =
    bitmap instanceof HTMLImageElement ? bitmap.naturalHeight : bitmap.height;
  if (!sourceWidth || !sourceHeight) {
    throw new ImageResizeError("decode-failed");
  }

  const side = Math.min(sourceWidth, sourceHeight);
  const sx = (sourceWidth - side) / 2;
  const sy = (sourceHeight - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ImageResizeError("canvas-unavailable");
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
  if (!(bitmap instanceof HTMLImageElement)) bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );
  if (!blob) {
    throw new ImageResizeError("encode-failed");
  }
  return blob;
}
