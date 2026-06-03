import { CreateOrderInputSchema, OrderStatusUpdateSchema } from "@monceri/shared";
import { z } from "zod";

export { CreateOrderInputSchema, OrderStatusUpdateSchema };

export const OrderNumberParamsSchema = z.object({
  orderNumber: z.string().min(1),
});
