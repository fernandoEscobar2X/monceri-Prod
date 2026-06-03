import { z } from "zod";
import { idSchema, slugSchema } from "../primitives";
import { ProductSummarySchema } from "./product";

const nullableDateTimeSchema = z.string().datetime().nullable().optional();
const optionalImageSchema = z.string().min(1).nullable().optional();

function validateDateRange(
  value: { startsAt?: null | string; endsAt?: null | string },
  ctx: z.RefinementCtx,
) {
  if (!value.startsAt || !value.endsAt) {
    return;
  }

  if (new Date(value.endsAt).getTime() <= new Date(value.startsAt).getTime()) {
    ctx.addIssue({
      code: "custom",
      message: "La fecha de fin debe ser posterior a la fecha de inicio.",
      path: ["endsAt"],
    });
  }
}

export const CollectionSchema = z.object({
  id: idSchema,
  name: z.string().min(2).max(80),
  slug: slugSchema,
  tagline: z.string().max(120).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  bannerImageUrl: optionalImageSchema,
  bannerImageThumbnailUrl: optionalImageSchema,
  popupImageUrl: optionalImageSchema,
  popupImageThumbnailUrl: optionalImageSchema,
  ctaLabel: z.string().max(30).nullable().optional(),
  startsAt: nullableDateTimeSchema,
  endsAt: nullableDateTimeSchema,
  active: z.boolean().default(true),
  showInPopup: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  products: z.array(ProductSummarySchema).default([]),
  productsCount: z.number().int().min(0).default(0),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type Collection = z.infer<typeof CollectionSchema>;

export const CollectionSummarySchema = CollectionSchema.omit({
  products: true,
}).extend({
  productsCount: z.number().int().min(0),
});
export type CollectionSummary = z.infer<typeof CollectionSummarySchema>;

export const CollectionUpsertBaseSchema = z.object({
  name: z.string().min(2).max(80),
  slug: slugSchema,
  tagline: z.string().max(120).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  bannerImageUrl: optionalImageSchema,
  bannerImageThumbnailUrl: optionalImageSchema,
  popupImageUrl: optionalImageSchema,
  popupImageThumbnailUrl: optionalImageSchema,
  ctaLabel: z.string().max(30).nullable().optional(),
  startsAt: nullableDateTimeSchema,
  endsAt: nullableDateTimeSchema,
  active: z.boolean().default(true),
  showInPopup: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const CollectionUpsertSchema = CollectionUpsertBaseSchema.superRefine(validateDateRange);
export type CollectionUpsertInput = z.infer<typeof CollectionUpsertSchema>;

export const CollectionUpdateSchema = CollectionUpsertBaseSchema.partial().superRefine(validateDateRange);
export type CollectionUpdateInput = z.infer<typeof CollectionUpdateSchema>;

export const ProductCollectionLinkSchema = z.object({
  productIds: z.array(idSchema).default([]),
});
export type ProductCollectionLinkInput = z.infer<typeof ProductCollectionLinkSchema>;
