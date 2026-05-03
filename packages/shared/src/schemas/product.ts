import { z } from "zod";
import { idSchema, moneySchema, slugSchema } from "../primitives";
import { CategorySchema } from "./category";

export const ProductImageSchema = z.object({
  id: idSchema,
  productId: idSchema,
  url: z.string().min(1),
  alt: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});
export type ProductImage = z.infer<typeof ProductImageSchema>;

export const ProductVariantSchema = z.object({
  id: idSchema,
  productId: idSchema,
  name: z.string().min(1),
  value: z.string().min(1),
  priceAdjust: moneySchema.default(0),
  stock: z.number().int().nullable().optional(),
  active: z.boolean().default(true),
});
export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductSchema = z.object({
  id: idSchema,
  name: z.string().min(2),
  slug: slugSchema,
  description: z.string().min(1),
  basePrice: moneySchema,
  comparePrice: moneySchema.nullable().optional(),
  categoryId: idSchema,
  trackStock: z.boolean().default(true),
  stock: z.number().int().min(0).default(0),
  lowStockAlert: z.number().int().min(0).default(5),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  images: z.array(ProductImageSchema).default([]),
  variants: z.array(ProductVariantSchema).default([]),
});
export type Product = z.infer<typeof ProductSchema>;

export const ProductSummarySchema = ProductSchema.pick({
  id: true,
  name: true,
  slug: true,
  description: true,
  basePrice: true,
  comparePrice: true,
  featured: true,
  stock: true,
  trackStock: true,
}).extend({
  category: CategorySchema.pick({ id: true, name: true, slug: true }).optional(),
  images: z.array(ProductImageSchema).default([]),
  variants: z.array(ProductVariantSchema).default([]),
});
export type ProductSummary = z.infer<typeof ProductSummarySchema>;

export const ProductListQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  search: z.string().optional(),
});
export type ProductListQuery = z.infer<typeof ProductListQuerySchema>;

export const ProductUpsertSchema = z.object({
  name: z.string().min(2),
  slug: slugSchema,
  description: z.string().min(1),
  basePrice: moneySchema,
  comparePrice: moneySchema.nullable().optional(),
  categoryId: idSchema,
  trackStock: z.boolean().default(true),
  stock: z.number().int().min(0).default(0),
  lowStockAlert: z.number().int().min(0).default(5),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});
export type ProductUpsertInput = z.infer<typeof ProductUpsertSchema>;
