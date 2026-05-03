import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { registerUploadedFile, uploadImage } from "./uploads.controller";

export async function registerUploadRoutes(app: FastifyInstance) {
  app.post("/uploads/images", { preHandler: authenticate }, uploadImage);
  app.post("/uploads/metadata", { preHandler: authenticate }, registerUploadedFile);
}
