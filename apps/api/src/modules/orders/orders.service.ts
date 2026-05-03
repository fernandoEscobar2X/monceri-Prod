import type { CreateOrderInput, OrderStatusUpdateInput } from "@monceri/shared";
import { ConflictError, NotFoundError, ValidationError } from "../../lib/errors";
import { couponsService } from "../coupons/coupons.service";
import { productsService } from "../products/products.service";
import { ordersRepository } from "./orders.repository";

function nextOrderNumber() {
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  return `MNC-${timestamp}`;
}

function buildWhatsappMessage(args: { input: CreateOrderInput; orderNumber: string; total: number }) {
  const lines = [
    `Nuevo pedido Monceri #${args.orderNumber}`,
    "",
    `Cliente: ${args.input.customerName}`,
    `Telefono: ${args.input.customerPhone}`,
    args.input.customerEmail ? `Email: ${args.input.customerEmail}` : null,
    "",
    `Total registrado: $${args.total.toLocaleString("es-MX")} MXN`,
    "",
    "Este pedido ya fue registrado en el sistema. Por favor confirma detalles, pago y envio por WhatsApp.",
  ].filter(Boolean);

  return lines.join("\n");
}

export const ordersService = {
  listAdmin() {
    return ordersRepository.listAdmin();
  },

  async create(input: CreateOrderInput) {
    const pricedItems = [];

    for (const item of input.items) {
      const product = await productsService.findActiveForOrder(item.productId);

      if (product.trackStock && product.stock < item.quantity) {
        throw new ConflictError(`Stock insuficiente para ${product.name}`);
      }

      const variantAdjust = product.variants
        .filter((variant) => variant.active && Object.values(item.variants).includes(variant.value))
        .reduce((sum, variant) => sum + Number(variant.priceAdjust), 0);
      const unitPrice = Number(product.basePrice) + variantAdjust;
      const subtotal = unitPrice * item.quantity;

      pricedItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        subtotal,
        unitPrice,
        variantData: item.variants,
      });
    }

    const subtotal = pricedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const couponResult = input.couponCode
      ? await couponsService.ensureValid(input.couponCode, subtotal)
      : null;
    const discount = couponResult?.discount ?? 0;
    const total = subtotal - discount;
    const orderNumber = nextOrderNumber();
    const order = await ordersRepository.createPending({
      couponId: couponResult?.coupon.id,
      discount,
      input,
      items: pricedItems,
      orderNumber,
      subtotal,
      total,
    });

    return {
      order,
      orderNumber,
      total,
      whatsappMessage: buildWhatsappMessage({ input, orderNumber, total }),
    };
  },

  async markWhatsappSent(orderNumber: string) {
    const order = await ordersRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new NotFoundError("Orden");
    }

    return ordersRepository.markWhatsappSent(orderNumber);
  },

  async updateStatus(orderNumber: string, input: OrderStatusUpdateInput, adminId: string) {
    const order = await ordersRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new NotFoundError("Orden");
    }

    if (order.status === "CANCELLED" && input.status !== "CANCELLED") {
      throw new ValidationError("No se puede reactivar una orden cancelada en v1");
    }

    if (input.status === "CONFIRMED" && order.status !== "CONFIRMED") {
      for (const item of order.items) {
        if (item.product.trackStock && item.product.stock < item.quantity) {
          throw new ConflictError(`Stock insuficiente para ${item.product.name}`);
        }
      }

      const confirmedOrder = await ordersRepository.confirmAndDecrementStock(orderNumber, input, adminId);

      if (!confirmedOrder) {
        throw new NotFoundError("Orden");
      }

      return confirmedOrder;
    }

    return ordersRepository.updateStatus(orderNumber, input);
  },
};
