import type { CreateOrderInput, OrderStatusUpdateInput } from "@monceri/shared";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type PricedOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  variantData: Prisma.InputJsonValue;
};

export const ordersRepository = {
  listAdmin() {
    return prisma.order.findMany({
      include: { items: true, coupon: true },
      orderBy: { createdAt: "desc" },
    });
  },

  findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      include: { items: { include: { product: true } }, coupon: true },
      where: { orderNumber },
    });
  },

  async createPending(args: {
    couponId?: string;
    discount: number;
    input: CreateOrderInput;
    items: PricedOrderItem[];
    subtotal: number;
    total: number;
  }) {
    return prisma.$transaction(async (tx) => {
      const orderNumber = await ordersRepository.nextOrderNumber(tx);

      return tx.order.create({
        data: {
          couponId: args.couponId,
          customerEmail: args.input.customerEmail || null,
          customerName: args.input.customerName,
          customerPhone: args.input.customerPhone,
          discount: args.discount,
          orderNumber,
          subtotal: args.subtotal,
          total: args.total,
          items: {
            create: args.items,
          },
        },
        include: { items: true },
      });
    });
  },

  async nextOrderNumber(tx: Prisma.TransactionClient, now = new Date()) {
    const year = now.getFullYear();
    const counter = await tx.orderCounter.upsert({
      create: {
        lastNumber: 1,
        year,
      },
      update: {
        lastNumber: {
          increment: 1,
        },
      },
      where: {
        year,
      },
    });

    return `MNC-${year}-${String(counter.lastNumber).padStart(3, "0")}`;
  },

  markWhatsappSent(orderNumber: string) {
    return prisma.order.update({
      data: {
        whatsappSent: true,
        whatsappSentAt: new Date(),
      },
      where: { orderNumber },
    });
  },

  updateStatus(orderNumber: string, input: OrderStatusUpdateInput) {
    return prisma.order.update({
      data: {
        notes: input.notes,
        status: input.status,
      },
      include: { items: true },
      where: { orderNumber },
    });
  },

  confirmAndDecrementStock(orderNumber: string, input: OrderStatusUpdateInput, adminId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        include: { items: { include: { product: true } } },
        where: { orderNumber },
      });

      if (!order) {
        return null;
      }

      for (const item of order.items) {
        if (!item.product.trackStock) {
          continue;
        }

        await tx.product.update({
          data: { stock: { decrement: item.quantity } },
          where: { id: item.productId },
        });
        await tx.stockMovement.create({
          data: {
            adminId,
            orderId: order.id,
            productId: item.productId,
            quantity: -item.quantity,
            reason: `Orden confirmada ${order.orderNumber}`,
            type: "SALE",
          },
        });
      }

      if (order.couponId) {
        await tx.coupon.update({
          data: {
            usedCount: {
              increment: 1,
            },
          },
          where: {
            id: order.couponId,
          },
        });
      }

      return tx.order.update({
        data: {
          notes: input.notes,
          status: input.status,
        },
        include: { items: true },
        where: { orderNumber },
      });
    });
  },
};
