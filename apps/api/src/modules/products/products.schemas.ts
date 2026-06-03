import { ProductListQuerySchema, ProductUpsertSchema, idSchema, slugSchema } from "@monceri/shared";
import { z } from "zod";

export { ProductListQuerySchema, ProductUpsertSchema };

export const ProductIdParamsSchema = z.object({
  id: idSchema,
});

export const ProductSlugParamsSchema = z.object({
  slug: slugSchema,
});

export const ProductUpdateSchema = ProductUpsertSchema.partial();
