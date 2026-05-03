import { z } from "zod";
import { idSchema, moneySchema } from "../primitives";

export const OrderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "IN_PRODUCTION",
  "READY",
  "DELIVERED",
  "CANCELLED",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

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

export const WhatsappOrderResponseSchema = z.object({
  orderNumber: z.string().min(1),
  whatsappMessage: z.string().min(1),
  total: moneySchema,
});
export type WhatsappOrderResponse = z.infer<typeof WhatsappOrderResponseSchema>;
