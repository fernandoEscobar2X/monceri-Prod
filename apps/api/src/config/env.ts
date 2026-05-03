import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_PRIVATE_KEY_PATH: z.string().min(1),
  JWT_PUBLIC_KEY_PATH: z.string().min(1),
  COOKIE_SECRET: z.string().min(32),
  WHATSAPP_PHONE_NUMBER: z.string().min(8),
  ADMIN_FRONTEND_URL: z.string().url(),
  WEB_FRONTEND_URL: z.string().url(),
  SENTRY_DSN: z.string().optional().default(""),
  LOG_LEVEL: z.string().default("info"),
});

export const env = envSchema.parse(process.env);

function readKey(path: string) {
  const resolvedPath = resolve(process.cwd(), path);

  if (!existsSync(resolvedPath)) {
    throw new Error(
      `Missing JWT key file: ${resolvedPath}. Run "pnpm --filter api keys:generate" before starting the API.`,
    );
  }

  return readFileSync(resolvedPath, "utf8");
}

export function readJwtKeys() {
  return {
    privateKey: readKey(env.JWT_PRIVATE_KEY_PATH),
    publicKey: readKey(env.JWT_PUBLIC_KEY_PATH),
  };
}
