const DATA_URL_RE = /^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/;

export type PhotoDoc = {
  data: Buffer;
  contentType: string;
} | null;

/**
 * Converts a base64 data URL (as sent by the client) into a Buffer + contentType
 * pair so it can be stored as binary data in MongoDB instead of as base64 text.
 */
export function dataUrlToPhoto(dataUrl?: string): PhotoDoc | undefined {
  if (!dataUrl) return null;

  const match = DATA_URL_RE.exec(dataUrl);
  if (!match) return null;

  const [, contentType, base64] = match;
  return { data: Buffer.from(base64, "base64"), contentType };
}

type StoredPhotoData =
  | Buffer
  | Uint8Array
  | { buffer: Buffer }
  // BSON Binary (returned by .lean() reads) — has .buffer and a .value()/.toString('base64') accessor.
  | { toString(encoding: "base64"): string };

function toBuffer(data: StoredPhotoData): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  // mongodb's Binary wraps the raw bytes in `.buffer`.
  if ("buffer" in data && data.buffer) return Buffer.isBuffer(data.buffer) ? data.buffer : Buffer.from(data.buffer);
  return Buffer.from(data.toString("base64"), "base64");
}

/**
 * Converts a stored Buffer + contentType pair back into a base64 data URL
 * for use in <img src> on the client.
 */
export function photoToDataUrl(photo?: { data?: StoredPhotoData | null; contentType?: string } | null) {
  if (!photo?.data || !photo.contentType) return undefined;

  const buffer = toBuffer(photo.data);
  if (!buffer.length) return undefined;

  return `data:${photo.contentType};base64,${buffer.toString("base64")}`;
}
