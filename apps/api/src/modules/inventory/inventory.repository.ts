import type { StockAdjustmentInput } from "@monceri/shared";
import { prisma } from "../../lib/prisma";

export const inventoryRepository = {
  listStock() {
    return prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        lowStockAlert: true,
        name: true,
        stock: true,
        trackStock: true,
        variants: true,
      },
    });
  },

  adjust(input: StockAdjustmentInput, adminId: string) {
    return prisma.$transaction(async (tx) => {
      if (input.variantId) {
        await tx.productVariant.update({
          data: {
            stock: {
              increment: input.quantity,
            },
          },
          where: { id: input.variantId },
        });
      } else {
        await tx.product.update({
          data: {
            stock: {
              increment: input.quantity,
            },
          },
          where: { id: input.productId },
        });
      }

      return tx.stockMovement.create({
        data: {
          adminId,
          productId: input.productId,
          quantity: input.quantity,
          reason: input.reason,
          type: "ADJUSTMENT",
          variantId: input.variantId,
        },
      });
    });
  },
};
