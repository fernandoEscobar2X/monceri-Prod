import type { StockAdjustmentInput } from "@monceri/shared";
import { inventoryRepository } from "./inventory.repository";

export const inventoryService = {
  listStock() {
    return inventoryRepository.listStock();
  },

  listMovements(productId?: string) {
    return inventoryRepository.listMovements(productId);
  },

  adjust(input: StockAdjustmentInput, adminId: string) {
    return inventoryRepository.adjust(input, adminId);
  },
};
