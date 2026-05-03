import type { FastifyReply, FastifyRequest } from "fastify";
import { CategoryIdParamsSchema, CategoryUpdateSchema, CategoryUpsertSchema } from "./categories.schemas";
import { categoriesService } from "./categories.service";

export async function listCategories(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await categoriesService.listPublic());
}

export async function listAdminCategories(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await categoriesService.listAdmin());
}

export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
  const input = CategoryUpsertSchema.parse(request.body);
  return reply.status(201).send(await categoriesService.create(input));
}

export async function updateCategory(request: FastifyRequest, reply: FastifyReply) {
  const params = CategoryIdParamsSchema.parse(request.params);
  const input = CategoryUpdateSchema.parse(request.body);
  return reply.send(await categoriesService.update(params.id, input));
}

export async function deleteCategory(request: FastifyRequest, reply: FastifyReply) {
  const params = CategoryIdParamsSchema.parse(request.params);
  await categoriesService.delete(params.id);
  return reply.status(204).send();
}
