import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { uploadImage } from "./uploads.controller";

export async function registerUploadRoutes(app: FastifyInstance) {
  app.post("/uploads", { preHandler: authenticate }, uploadImage);
}
