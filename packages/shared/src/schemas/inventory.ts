import { z } from "zod";
import { idSchema } from "../primitives";

export const StockMovementTypeSchema = z.enum(["PURCHASE", "SALE", "ADJUSTMENT", "RETURN"]);
export type StockMovementType = z.infer<typeof StockMovementTypeSchema>;

export const StockAdjustmentSchema = z.object({
  productId: idSchema,
  variantId: z.string().optional(),
  quantity: z.number().int(),
  reason: z.string().min(3),
});
export type StockAdjustmentInput = z.infer<typeof StockAdjustmentSchema>;

export const StockPolicySchema = z.enum(["PRODUCT", "VARIANT", "CUSTOM_MANUAL"]);
export type StockPolicy = z.infer<typeof StockPolicySchema>;
