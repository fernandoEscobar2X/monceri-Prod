import type { CartItem } from "./cart-types";
import { formatPrice } from "@/lib/formatters/price";

type CartItemCardProps = {
  item: CartItem;
  onDecrement: (id: string) => void;
  onIncrement: (id: string) => void;
};

export function CartItemCard({ item, onDecrement, onIncrement }: CartItemCardProps) {
  const isConfiguratorItem = item.type === "CONFIGURATOR";

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 rounded-[24px] bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0b0f19] p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
          {isConfiguratorItem ? "Letrero personalizado" : "Producto Monceri"}
        </div>
        <div className="mt-4 whitespace-pre-line text-3xl font-semibold text-white [text-shadow:0_0_18px_rgba(230,57,70,0.9)]">
          {isConfiguratorItem ? item.phrase : item.name}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-500">
        {isConfiguratorItem ? (
          <>
            <p>
              <span className="font-semibold text-[#111827]">Fuente:</span> {item.fontName}
            </p>
            <p>
              <span className="font-semibold text-[#111827]">Tamano:</span> {item.sizeLabel}
            </p>
            <p>
              <span className="font-semibold text-[#111827]">Color:</span> {item.colorLabel}
            </p>
            {item.lineCount > 1 ? (
              <p>
                <span className="font-semibold text-[#111827]">Renglones:</span> {item.lineCount}
              </p>
            ) : null}
            {item.addOns.length > 0 ? (
              <p>
                <span className="font-semibold text-[#111827]">Extras:</span> {item.addOns.join(", ")}
              </p>
            ) : null}
          </>
        ) : (
          <p>
            <span className="font-semibold text-[#111827]">Variantes:</span>{" "}
            {item.variantLabel || "Sin variantes"}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onDecrement(item.id)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300"
          >
            -
          </button>
          <span className="text-sm font-bold text-[#111827]">{item.qty}</span>
          <button
            type="button"
            onClick={() => onIncrement(item.id)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300"
          >
            +
          </button>
        </div>
        <span className="text-xl font-black tracking-tight text-[#111827]">
          {formatPrice(item.price * item.qty)}
        </span>
      </div>
    </div>
  );
}
