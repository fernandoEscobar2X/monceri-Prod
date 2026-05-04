import type { FastifyReply, FastifyRequest } from "fastify";
import { ValidationError } from "../../lib/errors";
import { uploadsService } from "./uploads.service";

export async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();

  if (!file) {
    throw new ValidationError("Archivo requerido");
  }

  const buffer = await file.toBuffer();
  return reply.status(201).send(await uploadsService.processProductImage(buffer));
}
