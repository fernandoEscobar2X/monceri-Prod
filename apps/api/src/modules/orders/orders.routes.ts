import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import {
  createOrder,
  getAdminOrder,
  listAdminOrders,
  markWhatsappSent,
  updateOrderStatus,
} from "./orders.controller";

export async function registerOrderRoutes(app: FastifyInstance) {
  app.post("/orders", createOrder);
  app.post("/orders/:orderNumber/mark-sent", markWhatsappSent);
  app.get("/admin/orders", { preHandler: authenticate }, listAdminOrders);
  app.get("/admin/orders/:orderNumber", { preHandler: authenticate }, getAdminOrder);
  app.patch("/admin/orders/:orderNumber/status", { preHandler: authenticate }, updateOrderStatus);
}
