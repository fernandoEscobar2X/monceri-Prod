"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { CheckoutForm } from "./checkout-form";
import { CartItemCard } from "./cart-item";
import { useCartStore } from "@/stores/cart";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 180;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Cerrar carrito"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#E63946]">
                  Checkout listo
                </p>
                <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-[#111827]">
                  Tu carrito
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-[#111827]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-[#F9FAFB] px-6 py-10 text-left">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <ShoppingBag className="size-6 text-[#E63946]" />
                  </div>
                  <p className="font-display text-2xl font-bold tracking-tight text-[#111827]">
                    Aun no agregas nada
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Configura tu letrero personalizado y agregalo al carrito para revisar el resumen.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onDecrement={decrementItem}
                    onIncrement={incrementItem}
                  />
                ))
              )}
            </div>

            <CheckoutForm
              onClose={onClose}
              shipping={shipping}
              subtotal={subtotal}
              total={total}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
