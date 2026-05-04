import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { env } from "../../config/env";

export const uploadsRepository = {
  async saveFile(relativePath: string, buffer: Buffer) {
    const fullPath = resolve(process.cwd(), env.UPLOADS_DIR, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, buffer);
    return { path: fullPath };
  },
};
