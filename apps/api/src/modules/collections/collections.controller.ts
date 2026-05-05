import type { FastifyReply, FastifyRequest } from "fastify";
import {
  CollectionIdParamsSchema,
  CollectionListQuerySchema,
  CollectionProductParamsSchema,
  CollectionSlugParamsSchema,
  CollectionUpdateSchema,
  CollectionUpsertSchema,
  ProductCollectionLinkSchema,
} from "./collections.schemas";
import { collectionsService } from "./collections.service";

export async function listCollections(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await collectionsService.listPublic());
}

export async function getCollection(request: FastifyRequest, reply: FastifyReply) {
  const params = CollectionSlugParamsSchema.parse(request.params);
  return reply.send(await collectionsService.findPublicBySlug(params.slug));
}

export async function getPopupCollection(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await collectionsService.findPopupActive());
}

export async function getHomeBannerCollection(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await collectionsService.findHomeBanner());
}

export async function listAdminCollections(request: FastifyRequest, reply: FastifyReply) {
  const query = CollectionListQuerySchema.parse(request.query);
  return reply.send(await collectionsService.listAdmin(query));
}

export async function getAdminCollection(request: FastifyRequest, reply: FastifyReply) {
  const params = CollectionIdParamsSchema.parse(request.params);
  return reply.send(await collectionsService.findAdminById(params.id));
}

export async function createCollection(request: FastifyRequest, reply: FastifyReply) {
  const input = CollectionUpsertSchema.parse(request.body);
  return reply.status(201).send(await collectionsService.create(input));
}

export async function updateCollection(request: FastifyRequest, reply: FastifyReply) {
  const params = CollectionIdParamsSchema.parse(request.params);
  const input = CollectionUpdateSchema.parse(request.body);
  return reply.send(await collectionsService.update(params.id, input));
}

export async function deleteCollection(request: FastifyRequest, reply: FastifyReply) {
  const params = CollectionIdParamsSchema.parse(request.params);
  await collectionsService.delete(params.id);
  return reply.status(204).send();
}

export async function replaceCollectionProducts(request: FastifyRequest, reply: FastifyReply) {
  const params = CollectionIdParamsSchema.parse(request.params);
  const input = ProductCollectionLinkSchema.parse(request.body);
  return reply.send(await collectionsService.replaceProducts(params.id, input));
}

export async function removeCollectionProduct(request: FastifyRequest, reply: FastifyReply) {
  const params = CollectionProductParamsSchema.parse(request.params);
  return reply.send(await collectionsService.removeProduct(params.id, params.productId));
}
