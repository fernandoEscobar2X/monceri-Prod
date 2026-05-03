import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { adjustStock, listStock } from "./inventory.controller";

export async function registerInventoryRoutes(app: FastifyInstance) {
  app.get("/inventory", { preHandler: authenticate }, listStock);
  app.post("/inventory/adjustments", { preHandler: authenticate }, adjustStock);
}
