import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { createCoupon, listAdminCoupons, updateCoupon, validateCoupon } from "./coupons.controller";

export async function registerCouponRoutes(app: FastifyInstance) {
  app.post("/coupons/validate", validateCoupon);
  app.get("/admin/coupons", { preHandler: authenticate }, listAdminCoupons);
  app.post("/admin/coupons", { preHandler: authenticate }, createCoupon);
  app.patch("/admin/coupons/:id", { preHandler: authenticate }, updateCoupon);
}
