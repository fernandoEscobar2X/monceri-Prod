import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { ConfigError } from "./config-error";

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
  UPLOADS_DIR: z.string().min(1).default("./uploads"),
  UPLOADS_URL_PREFIX: z.string().min(1).default("/uploads"),
  MAX_UPLOAD_SIZE_BYTES: z.coerce.number().int().positive().default(5 * 1024 * 1024),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new ConfigError(`Invalid API environment configuration. ${details}`);
}

export const env = parsedEnv.data;

function readKey(path: string) {
  const resolvedPath = resolve(process.cwd(), path);

  if (!existsSync(resolvedPath)) {
    throw new ConfigError(
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
