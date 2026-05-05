import { randomUUID } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { env } from "../../config/env";
import { ValidationError } from "../../lib/errors";
import { uploadsRepository } from "./uploads.repository";

const MAX_INPUT_PIXELS = 100_000_000;
const MAX_DIMENSION = 10_000;

async function resizeImageToWebp(buffer: Buffer, width: number) {
  const result = await sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS })
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    height: result.info.height,
    width: result.info.width,
  };
}

async function assertSafeImageMetadata(buffer: Buffer) {
  let metadata: sharp.Metadata;

  try {
    metadata = await sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS }).metadata();
  } catch {
    throw new ValidationError("Imagen invalida o corrupta");
  }

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (width === 0 || height === 0) {
    throw new ValidationError("No se pudieron leer las dimensiones de la imagen");
  }

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new ValidationError(
      `Imagen demasiado grande. Maximo ${MAX_DIMENSION}x${MAX_DIMENSION} pixeles`,
    );
  }
}

export const uploadsService = {
  async processProductImage(buffer: Buffer) {
    const detectedType = await fileTypeFromBuffer(buffer);

    if (!detectedType || !detectedType.mime.startsWith("image/")) {
      throw new ValidationError("El archivo debe ser una imagen valida");
    }

    await assertSafeImageMetadata(buffer);

    const id = randomUUID();
    const image = await resizeImageToWebp(buffer, 1920);
    const thumbnail = await resizeImageToWebp(buffer, 400);
    const imageFileName = `products/${id}.webp`;
    const thumbnailFileName = `products/${id}-thumb.webp`;

    await uploadsRepository.saveFile(imageFileName, image.buffer);
    await uploadsRepository.saveFile(thumbnailFileName, thumbnail.buffer);

    const prefix = env.UPLOADS_URL_PREFIX.endsWith("/")
      ? env.UPLOADS_URL_PREFIX.slice(0, -1)
      : env.UPLOADS_URL_PREFIX;

    return {
      url: `${prefix}/${imageFileName.replace(/\\/g, "/")}`,
      thumbnailUrl: `${prefix}/${thumbnailFileName.replace(/\\/g, "/")}`,
      width: image.width,
      height: image.height,
      sizeBytes: image.buffer.byteLength,
    };
  },
};
