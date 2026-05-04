"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProductSummary, ProductVariant } from "@monceri/shared";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { formatPrice } from "@/lib/formatters/price";
import { useCartStore } from "@/stores/cart";

function groupVariants(variants: ProductVariant[]) {
  return variants
    .filter((variant) => variant.active)
    .reduce<Record<string, ProductVariant[]>>((groups, variant) => {
      return {
        ...groups,
        [variant.name]: [...(groups[variant.name] ?? []), variant],
      };
    }, {});
}

function cartId(productId: string, variants: Record<string, string>) {
  const variantKey = Object.entries(variants)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join(".");

  return `${productId}|${variantKey}`;
}

export function ProductPurchase({ product }: { product: ProductSummary }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const variantGroups = useMemo(() => groupVariants(product.variants), [product.variants]);
  const selectedAdjust = product.variants
    .filter((variant) => selectedVariants[variant.name] === variant.value)
    .reduce((sum, variant) => sum + variant.priceAdjust, 0);
  const unitPrice = product.basePrice + selectedAdjust;
  const missingVariant = Object.keys(variantGroups).some((name) => !selectedVariants[name]);

  function addToCart() {
    if (missingVariant) {
      return;
    }

    const variantLabel =
      Object.entries(selectedVariants)
        .map(([name, value]) => `${name}: ${value}`)
        .join(", ") || "Sin variantes";

    addItem({
      id: cartId(product.id, selectedVariants),
      name: product.name,
      price: unitPrice,
      productId: product.id,
      qty: quantity,
      type: "PRODUCT",
      variantLabel,
      variants: selectedVariants,
    });
    setToastOpen(true);
    window.setTimeout(() => setToastOpen(false), 4000);
  }

  return (
    <>
      <div className="mt-8 space-y-7">
        {Object.entries(variantGroups).map(([name, variants]) => (
          <div key={name}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">{name}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {variants.map((variant) => {
                const active = selectedVariants[name] === variant.value;

                return (
                  <button
                    key={variant.id}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-[#111827] bg-[#111827] text-white"
                        : "border-gray-200 bg-white text-[#111827] hover:border-[#111827]"
                    }`}
                    onClick={() => setSelectedVariants((current) => ({ ...current, [name]: variant.value }))}
                    type="button"
                  >
                    {variant.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Cantidad</p>
          <div className="mt-3 inline-flex items-center rounded-full border border-gray-200 bg-white">
            <button className="size-11 text-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))} type="button">
              -
            </button>
            <span className="w-10 text-center text-sm font-bold">{quantity}</span>
            <button className="size-11 text-lg" onClick={() => setQuantity(quantity + 1)} type="button">
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <span className="text-sm font-semibold text-gray-500">Total producto</span>
          <span className="text-3xl font-bold text-[#111827]">{formatPrice(unitPrice * quantity)}</span>
        </div>

        <button
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#E63946] px-5 text-base font-bold text-white shadow-[0_18px_34px_rgba(230,57,70,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[#F29AA3]"
          disabled={missingVariant}
          onClick={addToCart}
          type="button"
        >
          <ShoppingCart className="size-5" />
          Agregar al carrito
        </button>
      </div>

      <AnimatePresence>
        {toastOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-5 right-5 z-40 rounded-2xl bg-[#111827] px-5 py-4 text-white shadow-2xl"
            exit={{ opacity: 0, y: 12 }}
            initial={{ opacity: 0, y: 12 }}
          >
            <p className="text-sm font-bold">Agregado al carrito</p>
            <button className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/70" onClick={() => setCartOpen(true)} type="button">
              Ver carrito
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
