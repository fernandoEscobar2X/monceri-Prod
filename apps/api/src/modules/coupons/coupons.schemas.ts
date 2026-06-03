import { CouponUpsertSchema, CouponValidateSchema, idSchema } from "@monceri/shared";
import { z } from "zod";

export { CouponUpsertSchema, CouponValidateSchema };

export const CouponIdParamsSchema = z.object({
  id: idSchema,
});

export const CouponUpdateSchema = CouponUpsertSchema.partial();
