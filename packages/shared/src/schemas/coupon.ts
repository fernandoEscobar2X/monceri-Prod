import { z } from "zod";
import { idSchema, moneySchema } from "../primitives";

export const CouponTypeSchema = z.enum(["PERCENTAGE", "FIXED_AMOUNT"]);
export type CouponType = z.infer<typeof CouponTypeSchema>;

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
