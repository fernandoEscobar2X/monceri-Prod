import type { FastifyReply, FastifyRequest } from "fastify";
import { UploadMetadataSchema } from "./uploads.schemas";
import { uploadsService } from "./uploads.service";

export async function uploadImage(_request: FastifyRequest, reply: FastifyReply) {
  return reply.status(501).send({
    code: "UPLOADS_NOT_IMPLEMENTED",
    message: "Uploads con validacion MIME, Sharp y WebP quedan documentados para la siguiente fase.",
  });
}

export async function registerUploadedFile(request: FastifyRequest, reply: FastifyReply) {
  const input = UploadMetadataSchema.parse(request.body);
  return reply.status(201).send(await uploadsService.registerUploadedFile(input.url));
}
