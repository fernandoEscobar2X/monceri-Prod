import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { ZodError } from "zod";
import { env, readJwtKeys } from "./config/env";
import { AppError } from "./lib/errors";
import { prisma } from "./lib/prisma";
import { registerAuthRoutes } from "./modules/auth/auth.routes";
import { registerCategoryRoutes } from "./modules/categories/categories.routes";
import { registerCouponRoutes } from "./modules/coupons/coupons.routes";
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

  await app.register(helmet);
  await app.register(cors, {
    credentials: true,
    origin: [env.WEB_FRONTEND_URL, env.ADMIN_FRONTEND_URL],
  });
  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });
  await app.register(jwt, {
    cookie: {
      cookieName: "monceri_admin_token",
      signed: false,
    },
    sign: {
      algorithm: "RS256",
      expiresIn: "15m",
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
      fileSize: 5 * 1024 * 1024,
      files: 1,
    },
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

    app.log.error(error);
    return reply.status(500).send({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error interno",
    });
  });

  app.get("/health", async () => ({ ok: true }));

  await app.register(registerCategoryRoutes, { prefix: "/api" });
  await app.register(registerProductRoutes, { prefix: "/api" });
  await app.register(registerCouponRoutes, { prefix: "/api" });
  await app.register(registerOrderRoutes, { prefix: "/api" });
  await app.register(registerAuthRoutes, { prefix: "/api/admin/auth" });
  await app.register(registerInventoryRoutes, { prefix: "/api/admin" });
  await app.register(registerUploadRoutes, { prefix: "/api/admin" });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = await buildServer();
  await app.listen({
    host: "127.0.0.1",
    port: env.PORT,
  });
}
