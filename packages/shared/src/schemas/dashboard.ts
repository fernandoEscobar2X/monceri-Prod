import { z } from "zod";
import { moneySchema } from "../primitives";

export const DashboardSummarySchema = z.object({
  ordersThisMonth: z.number().int().min(0),
  revenueThisMonth: moneySchema,
  pendingOrders: z.number().int().min(0),
  lowStockProducts: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      stock: z.number().int(),
      lowStockAlert: z.number().int(),
    }),
  ),
  recentOrders: z.array(z.unknown()),
  weeklyRevenue: z.array(
    z.object({
      week: z.string().min(1),
      total: moneySchema,
    }),
  ),
});
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
