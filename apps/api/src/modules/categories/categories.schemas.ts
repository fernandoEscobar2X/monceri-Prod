import { CategoryUpsertSchema, idSchema } from "@monceri/shared";
import { z } from "zod";

export { CategoryUpsertSchema };

export const CategoryIdParamsSchema = z.object({
  id: idSchema,
});

export const CategoryUpdateSchema = CategoryUpsertSchema.partial();
