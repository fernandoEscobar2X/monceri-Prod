import { z } from "zod";

export const AdminRoleSchema = z.enum(["ADMIN", "SUPERADMIN"]);
export type AdminRole = z.infer<typeof AdminRoleSchema>;

export const OrderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "IN_PRODUCTION",
  "READY",
  "DELIVERED",
  "CANCELLED",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const CouponTypeSchema = z.enum(["PERCENTAGE", "FIXED_AMOUNT"]);
export type CouponType = z.infer<typeof CouponTypeSchema>;

export const StockMovementTypeSchema = z.enum(["PURCHASE", "SALE", "ADJUSTMENT", "RETURN"]);
export type StockMovementType = z.infer<typeof StockMovementTypeSchema>;

export const moneySchema = z.number().finite().min(0);
export const idSchema = z.string().min(1);
export const slugSchema = z
  .string()
  .min(2)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

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

export const CategoryUpsertSchema = z.object({
  name: z.string().min(2),
  slug: slugSchema,
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type CategoryUpsertInput = z.infer<typeof CategoryUpsertSchema>;

export const CartVariantSelectionSchema = z.record(z.string().min(1), z.string().min(1));
export type CartVariantSelection = z.infer<typeof CartVariantSelectionSchema>;

export const CreateOrderItemSchema = z.object({
  productId: idSchema,
  quantity: z.number().int().min(1).max(50),
  variants: CartVariantSelectionSchema.default({}),
});
export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;

export const CreateOrderInputSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerEmail: z.string().email().optional().or(z.literal("")),
  couponCode: z.string().optional(),
  items: z.array(CreateOrderItemSchema).min(1),
});
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

export const OrderItemSchema = z.object({
  id: idSchema,
  orderId: idSchema,
  productId: idSchema,
  productName: z.string().min(1),
  variantData: CartVariantSelectionSchema,
  unitPrice: moneySchema,
  quantity: z.number().int().min(1),
  subtotal: moneySchema,
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: idSchema,
  orderNumber: z.string().min(1),
  status: OrderStatusSchema,
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerEmail: z.string().nullable().optional(),
  subtotal: moneySchema,
  discount: moneySchema,
  total: moneySchema,
  whatsappSent: z.boolean(),
  whatsappSentAt: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional(),
  couponId: z.string().nullable().optional(),
  items: z.array(OrderItemSchema).default([]),
});
export type Order = z.infer<typeof OrderSchema>;

export const OrderStatusUpdateSchema = z.object({
  status: OrderStatusSchema,
  notes: z.string().optional(),
});
export type OrderStatusUpdateInput = z.infer<typeof OrderStatusUpdateSchema>;

export const CouponSchema = z.object({
  id: idSchema,
  code: z.string().min(2),
  type: CouponTypeSchema,
  value: moneySchema,
  minPurchase: moneySchema.nullable().optional(),
  maxUses: z.number().int().nullable().optional(),
  usedCount: z.number().int().default(0),
  expiresAt: z.string().datetime().nullable().optional(),
  active: z.boolean().default(true),
});
export type Coupon = z.infer<typeof CouponSchema>;

export const CouponUpsertSchema = z.object({
  code: z.string().min(2).transform((value) => value.trim().toUpperCase()),
  type: CouponTypeSchema,
  value: moneySchema,
  minPurchase: moneySchema.nullable().optional(),
  maxUses: z.number().int().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  active: z.boolean().default(true),
});
export type CouponUpsertInput = z.infer<typeof CouponUpsertSchema>;

export const CouponValidateSchema = z.object({
  code: z.string().min(2),
  subtotal: moneySchema,
});
export type CouponValidateInput = z.infer<typeof CouponValidateSchema>;

export const StockAdjustmentSchema = z.object({
  productId: idSchema,
  variantId: z.string().optional(),
  quantity: z.number().int(),
  reason: z.string().min(3),
});
export type StockAdjustmentInput = z.infer<typeof StockAdjustmentSchema>;

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;

export const AdminSessionSchema = z.object({
  id: idSchema,
  email: z.string().email(),
  name: z.string().min(1),
  role: AdminRoleSchema,
});
export type AdminSession = z.infer<typeof AdminSessionSchema>;

export const WhatsappOrderResponseSchema = z.object({
  orderNumber: z.string().min(1),
  whatsappMessage: z.string().min(1),
  total: moneySchema,
});
export type WhatsappOrderResponse = z.infer<typeof WhatsappOrderResponseSchema>;
