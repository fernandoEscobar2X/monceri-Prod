import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { uploadImage } from "./uploads.controller";

export async function registerUploadRoutes(app: FastifyInstance) {
  app.post("/uploads", {
    config: {
      rateLimit: {
        max: 30,
        timeWindow: "1 minute",
      },
    },
    handler: uploadImage,
    preHandler: authenticate,
  });
}
