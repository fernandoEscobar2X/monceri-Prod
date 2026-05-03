import type { FastifyReply, FastifyRequest } from "fastify";
import { StockAdjustmentSchema } from "@monceri/shared";
import { currentAdminId } from "../../plugins/auth";
import { inventoryService } from "./inventory.service";

export async function listStock(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await inventoryService.listStock());
}

export async function adjustStock(request: FastifyRequest, reply: FastifyReply) {
  const input = StockAdjustmentSchema.parse(request.body);
  return reply.status(201).send(await inventoryService.adjust(input, currentAdminId(request)));
}
