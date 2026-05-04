"use client";

import type { ConfiguratorInput } from "@monceri/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConfiguratorCartItem = {
  type: "CONFIGURATOR";
  id: string;
  phrase: string;
  fontName: string;
  sizeLabel: string;
  lineCount: number;
  colorLabel: string;
  addOns: string[];
  price: number;
  qty: number;
  configuration: ConfiguratorInput;
};

export type ProductCartItem = {
  type: "PRODUCT";
  id: string;
  productId: string;
  name: string;
  variantLabel: string;
  variants: Record<string, string>;
  price: number;
  qty: number;
};

export type CartItem = ConfiguratorCartItem | ProductCartItem;

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clearCart: () => void;
  decrementItem: (id: string) => void;
  incrementItem: (id: string) => void;
  removeItem: (id: string) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((currentItem) => currentItem.id === item.id);

          if (!existingItem) {
            return { items: [...state.items, item] };
          }

          return {
            items: state.items.map((currentItem) =>
              currentItem.id === item.id
                ? { ...currentItem, qty: currentItem.qty + item.qty }
                : currentItem,
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      decrementItem: (id) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
            .filter((item) => item.qty > 0),
        })),
      incrementItem: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "monceri-cart-v1",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
