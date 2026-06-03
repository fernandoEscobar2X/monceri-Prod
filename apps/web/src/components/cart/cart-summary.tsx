import type { ReactNode } from "react";
import { formatPrice } from "@/lib/formatters/price";

type CartSummaryProps = {
  children?: ReactNode;
  shipping: number;
  subtotal: number;
  total: number;
};

export function CartSummary({ children, shipping, subtotal, total }: CartSummaryProps) {
  return (
    <div className="border-t border-gray-200 px-6 py-6">
      <div className="space-y-3 rounded-3xl bg-[#F9FAFB] p-5">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-semibold text-[#111827]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Envio</span>
          <span className="font-semibold text-[#111827]">
            {shipping === 0 ? "Gratis" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-white pt-3 text-base text-[#111827]">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-black tracking-tight">{formatPrice(total)}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
