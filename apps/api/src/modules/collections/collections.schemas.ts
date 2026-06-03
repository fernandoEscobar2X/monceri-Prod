import {
  CollectionUpdateSchema,
  CollectionUpsertSchema,
  ProductCollectionLinkSchema,
  idSchema,
  slugSchema,
} from "@monceri/shared";
import { z } from "zod";

export { CollectionUpdateSchema, CollectionUpsertSchema, ProductCollectionLinkSchema };

export const CollectionIdParamsSchema = z.object({
  id: idSchema,
});

export const CollectionSlugParamsSchema = z.object({
  slug: slugSchema,
});

export const CollectionProductParamsSchema = z.object({
  id: idSchema,
  productId: idSchema,
});

export const CollectionListQuerySchema = z.object({
  active: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
});
