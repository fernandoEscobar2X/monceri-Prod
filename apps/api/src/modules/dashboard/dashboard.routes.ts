import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { getDashboardSummary } from "./dashboard.controller";

export async function registerDashboardRoutes(app: FastifyInstance) {
  app.get("/dashboard/summary", { preHandler: authenticate }, getDashboardSummary);
}
