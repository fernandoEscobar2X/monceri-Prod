import type { FastifyReply, FastifyRequest } from "fastify";
import { currentAdminId } from "../../plugins/auth";
import { CreateOrderInputSchema, OrderNumberParamsSchema, OrderStatusUpdateSchema } from "./orders.schemas";
import { ordersService } from "./orders.service";

export async function createOrder(request: FastifyRequest, reply: FastifyReply) {
  const input = CreateOrderInputSchema.parse(request.body);
  const result = await ordersService.create(input);

  return reply.status(201).send({
    orderNumber: result.orderNumber,
    total: result.total,
    whatsappMessage: result.whatsappMessage,
  });
}

export async function markWhatsappSent(request: FastifyRequest, reply: FastifyReply) {
  const params = OrderNumberParamsSchema.parse(request.params);
  return reply.send(await ordersService.markWhatsappSent(params.orderNumber));
}

export async function listAdminOrders(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await ordersService.listAdmin());
}

export async function updateOrderStatus(request: FastifyRequest, reply: FastifyReply) {
  const params = OrderNumberParamsSchema.parse(request.params);
  const input = OrderStatusUpdateSchema.parse(request.body);
  return reply.send(await ordersService.updateStatus(params.orderNumber, input, currentAdminId(request)));
}
