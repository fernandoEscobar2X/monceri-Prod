import { z } from "zod";
import { idSchema, slugSchema } from "../primitives";

export const CategorySchema = z.object({
  id: idSchema,
  name: z.string().min(2),
  slug: slugSchema,
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type Category = z.infer<typeof CategorySchema>;

export const CategoryUpsertSchema = z.object({
  name: z.string().min(2),
  slug: slugSchema,
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type CategoryUpsertInput = z.infer<typeof CategoryUpsertSchema>;
