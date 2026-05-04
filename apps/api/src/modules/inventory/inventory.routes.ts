import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { adjustStock, listMovements, listStock } from "./inventory.controller";

export async function registerInventoryRoutes(app: FastifyInstance) {
  app.get("/inventory/stock", { preHandler: authenticate }, listStock);
  app.get("/inventory/movements", { preHandler: authenticate }, listMovements);
  app.post("/inventory/adjustments", { preHandler: authenticate }, adjustStock);
}
