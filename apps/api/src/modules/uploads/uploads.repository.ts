import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { env } from "../../config/env";
import { AppError } from "../../lib/errors";

export const uploadsRepository = {
  async saveFile(relativePath: string, buffer: Buffer) {
    const fullPath = resolve(process.cwd(), env.UPLOADS_DIR, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });

    try {
      await writeFile(fullPath, buffer);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOSPC") {
        throw new AppError(
          "No hay espacio disponible en el servidor. Contacta al administrador.",
          507,
          "STORAGE_FULL",
        );
      }

      throw error;
    }

    return { path: fullPath };
  },
};
