import { idSchema, StockAdjustmentSchema } from "@monceri/shared";
import { z } from "zod";

export { StockAdjustmentSchema };

export const StockMovementQuerySchema = z.object({
  productId: idSchema.optional(),
});
