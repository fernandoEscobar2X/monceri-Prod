import type { FastifyReply, FastifyRequest } from "fastify";
import {
  ProductIdParamsSchema,
  ProductListQuerySchema,
  ProductSlugParamsSchema,
  ProductUpdateSchema,
  ProductUpsertSchema,
} from "./products.schemas";
import { productsService } from "./products.service";

export async function listProducts(request: FastifyRequest, reply: FastifyReply) {
  const query = ProductListQuerySchema.parse(request.query);
  return reply.send(await productsService.listPublic(query));
}

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const params = ProductSlugParamsSchema.parse(request.params);
  return reply.send(await productsService.findPublicBySlug(params.slug));
}

export async function listAdminProducts(request: FastifyRequest, reply: FastifyReply) {
  const query = ProductListQuerySchema.parse(request.query);
  return reply.send(await productsService.listAdmin(query));
}

export async function getAdminProduct(request: FastifyRequest, reply: FastifyReply) {
  const params = ProductIdParamsSchema.parse(request.params);
  return reply.send(await productsService.findAdminById(params.id));
}

export async function createProduct(request: FastifyRequest, reply: FastifyReply) {
  const input = ProductUpsertSchema.parse(request.body);
  return reply.status(201).send(await productsService.create(input));
}

export async function updateProduct(request: FastifyRequest, reply: FastifyReply) {
  const params = ProductIdParamsSchema.parse(request.params);
  const input = ProductUpdateSchema.parse(request.body);
  return reply.send(await productsService.update(params.id, input));
}

export async function deleteProduct(request: FastifyRequest, reply: FastifyReply) {
  const params = ProductIdParamsSchema.parse(request.params);
  await productsService.delete(params.id);
  return reply.status(204).send();
}
