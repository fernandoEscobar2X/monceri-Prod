import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ZodError } from "zod";
import { env, readJwtKeys } from "./config/env";
import { checkDatabaseConnection, closeDatabaseConnection } from "./lib/database";
import { AppError } from "./lib/errors";
import { registerAuthRoutes } from "./modules/auth/auth.routes";
import { tokenRevocationService } from "./modules/auth/token-revocation.service";
import { registerCategoryRoutes } from "./modules/categories/categories.routes";
import { registerCollectionRoutes } from "./modules/collections/collections.routes";
import { registerCouponRoutes } from "./modules/coupons/coupons.routes";
import { registerDashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { registerInventoryRoutes } from "./modules/inventory/inventory.routes";
import { registerOrderRoutes } from "./modules/orders/orders.routes";
import { registerProductRoutes } from "./modules/products/products.routes";
import { registerUploadRoutes } from "./modules/uploads/uploads.routes";

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
  });

  const keys = readJwtKeys();

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        connectSrc: ["'self'", env.WEB_FRONTEND_URL, env.ADMIN_FRONTEND_URL],
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        ...(env.NODE_ENV === "production" ? { upgradeInsecureRequests: [] } : {}),
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });
  await app.register(cors, {
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86_400,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    origin: [env.ADMIN_FRONTEND_URL, env.WEB_FRONTEND_URL],
  });
  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });
  await app.register(jwt, {
    cookie: {
      cookieName: "monceri_admin_token",
      signed: true,
    },
    sign: {
      algorithm: "RS256",
      aud: "monceri-admin",
      expiresIn: "15m",
      iss: env.JWT_ISSUER,
    },
    verify: {
      allowedAud: "monceri-admin",
      allowedIss: env.JWT_ISSUER,
    },
    secret: {
      private: keys.privateKey,
      public: keys.publicKey,
    },
  });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
  await app.register(multipart, {
    limits: {
      fileSize: env.MAX_UPLOAD_SIZE_BYTES,
      files: 1,
    },
  });
  await app.register(fastifyStatic, {
    root: resolve(process.cwd(), env.UPLOADS_DIR),
    prefix: env.UPLOADS_URL_PREFIX.endsWith("/")
      ? env.UPLOADS_URL_PREFIX
      : `${env.UPLOADS_URL_PREFIX}/`,
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(422).send({
        code: "VALIDATION_ERROR",
        message: "Datos invalidos",
        issues: error.issues,
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
      });
    }

    const httpError = error as { code?: unknown; message?: string; statusCode?: number };

    if (
      typeof httpError.statusCode === "number" &&
      httpError.statusCode >= 400 &&
      httpError.statusCode < 500
    ) {
      return reply.status(httpError.statusCode).send({
        code: typeof httpError.code === "string" ? httpError.code : "HTTP_ERROR",
        message: httpError.message ?? "Solicitud invalida",
      });
    }

    app.log.error(error);
    return reply.status(500).send({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error interno",
    });
  });

  app.get("/health", async (_request, reply) => {
    try {
      await checkDatabaseConnection();

      return {
        db: "ok",
        ok: true,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return reply.status(503).send({
        db: "error",
        ok: false,
        timestamp: new Date().toISOString(),
      });
    }
  });

  await app.register(registerCategoryRoutes, { prefix: "/api" });
  await app.register(registerCollectionRoutes, { prefix: "/api" });
  await app.register(registerProductRoutes, { prefix: "/api" });
  await app.register(registerCouponRoutes, { prefix: "/api" });
  await app.register(registerOrderRoutes, { prefix: "/api" });
  await app.register(registerAuthRoutes, { prefix: "/api/admin/auth" });
  await app.register(registerInventoryRoutes, { prefix: "/api/admin" });
  await app.register(registerDashboardRoutes, { prefix: "/api/admin" });
  await app.register(registerUploadRoutes, { prefix: "/api/admin" });

  const revocationCleanupTimer = setInterval(() => {
    void tokenRevocationService.cleanupExpired().catch((error: unknown) => {
      app.log.error(error, "Error cleaning expired revoked tokens");
    });
  }, 60 * 60 * 1000);
  revocationCleanupTimer.unref();

  app.addHook("onClose", async () => {
    clearInterval(revocationCleanupTimer);
    await closeDatabaseConnection();
  });

  return app;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const app = await buildServer();
  await app.listen({
    host: "0.0.0.0",
    port: env.PORT,
  });
}
