import type { CouponUpsertInput } from "@monceri/shared";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { couponsRepository } from "./coupons.repository";

export function calculateDiscount(args: {
  coupon: Awaited<ReturnType<typeof couponsRepository.findByCode>>;
  subtotal: number;
}) {
  const { coupon, subtotal } = args;

  if (!coupon || !coupon.active) {
    return { valid: false, discount: 0, reason: "Cupon invalido" };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, discount: 0, reason: "Cupon expirado" };
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discount: 0, reason: "Cupon agotado" };
  }

  const minPurchase = Number(coupon.minPurchase ?? 0);

  if (subtotal < minPurchase) {
    return { valid: false, discount: 0, reason: "Compra minima no alcanzada" };
  }

  const value = Number(coupon.value);
  const discount = coupon.type === "PERCENTAGE" ? subtotal * (value / 100) : value;

  return {
    valid: true,
    discount: Math.min(subtotal, Math.round(discount)),
    reason: null,
  };
}

export const couponsService = {
  listAdmin() {
    return couponsRepository.listAdmin();
  },

  async findById(id: string) {
    const coupon = await couponsRepository.findById(id);

    if (!coupon) {
      throw new NotFoundError("Cupon");
    }

    return coupon;
  },

  async validate(code: string, subtotal: number) {
    const coupon = await couponsRepository.findByCode(code);
    return calculateDiscount({ coupon, subtotal });
  },

  create(input: CouponUpsertInput) {
    return couponsRepository.create(input);
  },

  async update(id: string, input: Partial<CouponUpsertInput>) {
    const coupon = await couponsRepository.findById(id);

    if (!coupon) {
      throw new NotFoundError("Cupon");
    }

    return couponsRepository.update(id, input);
  },

  async delete(id: string) {
    const coupon = await couponsRepository.findById(id);

    if (!coupon) {
      throw new NotFoundError("Cupon");
    }

    return couponsRepository.delete(id);
  },

  async ensureValid(code: string, subtotal: number) {
    const coupon = await couponsRepository.findByCode(code);
    const result = calculateDiscount({ coupon, subtotal });

    if (!result.valid || !coupon) {
      throw new ValidationError(result.reason ?? "Cupon invalido");
    }

    return { coupon, discount: result.discount };
  },
};
