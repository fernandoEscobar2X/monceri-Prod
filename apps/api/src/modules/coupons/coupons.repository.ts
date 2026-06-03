import type { CouponUpsertInput } from "@monceri/shared";
import { prisma } from "../../lib/prisma";

export const couponsRepository = {
  listAdmin() {
    return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  },

  findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
  },

  findById(id: string) {
    return prisma.coupon.findUnique({ where: { id } });
  },

  create(input: CouponUpsertInput) {
    return prisma.coupon.create({
      data: {
        ...input,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    });
  },

  update(id: string, input: Partial<CouponUpsertInput>) {
    return prisma.coupon.update({
      data: {
        ...input,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      },
      where: { id },
    });
  },

  delete(id: string) {
    return prisma.coupon.update({
      data: { active: false },
      where: { id },
    });
  },
};
