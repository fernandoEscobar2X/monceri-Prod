import type { FastifyReply, FastifyRequest } from "fastify";
import { dashboardService } from "./dashboard.service";

export async function getDashboardSummary(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await dashboardService.summary());
}
