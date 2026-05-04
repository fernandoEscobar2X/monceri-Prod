import { z } from "zod";
import { idSchema, moneySchema, slugSchema } from "../primitives";
import { CategorySchema } from "./category";

export const ProductImageSchema = z.object({
  id: idSchema,
  productId: idSchema,
  url: z.string().min(1),
  thumbnailUrl: z.string().nullable().optional(),
  alt: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});
export type ProductImage = z.infer<typeof ProductImageSchema>;

export const ProductImageInputSchema = z.object({
  url: z.string().min(1),
  thumbnailUrl: z.string().nullable().optional(),
  alt: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});
export type ProductImageInput = z.infer<typeof ProductImageInputSchema>;

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

export const ProductVariantInputSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  priceAdjust: moneySchema.default(0),
  stock: z.number().int().nullable().optional(),
  active: z.boolean().default(true),
});
export type ProductVariantInput = z.infer<typeof ProductVariantInputSchema>;

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
  active: true,
  categoryId: true,
  metaDescription: true,
  metaTitle: true,
}).extend({
  category: CategorySchema.pick({ id: true, name: true, slug: true }).optional(),
  categoryName: z.string().optional(),
  images: z.array(ProductImageSchema).default([]),
  thumbnail: z.string().nullable().optional(),
  variants: z.array(ProductVariantSchema).default([]),
});
export type ProductSummary = z.infer<typeof ProductSummarySchema>;

export const ProductListSortSchema = z.enum(["price_asc", "price_desc", "newest", "featured"]);
export type ProductListSort = z.infer<typeof ProductListSortSchema>;

export const ProductListQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().finite().min(0).optional(),
  maxPrice: z.coerce.number().finite().min(0).optional(),
  sort: ProductListSortSchema.default("featured"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});
export type ProductListQuery = z.infer<typeof ProductListQuerySchema>;

export const ProductListResponseSchema = z.object({
  items: z.array(ProductSummarySchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().min(0),
});
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;

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
  images: z.array(ProductImageInputSchema).default([]),
  variants: z.array(ProductVariantInputSchema).default([]),
});
export type ProductUpsertInput = z.infer<typeof ProductUpsertSchema>;

export const UploadImageResponseSchema = z.object({
  url: z.string().min(1),
  thumbnailUrl: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  sizeBytes: z.number().int().positive(),
});
export type UploadImageResponse = z.infer<typeof UploadImageResponseSchema>;
