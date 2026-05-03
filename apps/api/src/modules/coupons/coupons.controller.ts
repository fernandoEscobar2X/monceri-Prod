import type { FastifyReply, FastifyRequest } from "fastify";
import {
  CouponIdParamsSchema,
  CouponUpdateSchema,
  CouponUpsertSchema,
  CouponValidateSchema,
} from "./coupons.schemas";
import { couponsService } from "./coupons.service";

export async function validateCoupon(request: FastifyRequest, reply: FastifyReply) {
  const input = CouponValidateSchema.parse(request.body);
  return reply.send(await couponsService.validate(input.code, input.subtotal));
}

export async function listAdminCoupons(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await couponsService.listAdmin());
}

export async function createCoupon(request: FastifyRequest, reply: FastifyReply) {
  const input = CouponUpsertSchema.parse(request.body);
  return reply.status(201).send(await couponsService.create(input));
}

export async function updateCoupon(request: FastifyRequest, reply: FastifyReply) {
  const params = CouponIdParamsSchema.parse(request.params);
  const input = CouponUpdateSchema.parse(request.body);
  return reply.send(await couponsService.update(params.id, input));
}
