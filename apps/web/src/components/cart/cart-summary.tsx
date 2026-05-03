import { Lock, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/formatters/price";

type CartSummaryProps = {
  shipping: number;
  subtotal: number;
  total: number;
};

export function CartSummary({ shipping, subtotal, total }: CartSummaryProps) {
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

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-[#009EE3]" />
          <span>Pago 100% seguro</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-[#E63946]" />
          <span>Garantia de fabricacion</span>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#E63946] px-5 text-base font-bold text-white shadow-[0_18px_34px_rgba(230,57,70,0.24)] transition hover:-translate-y-0.5"
      >
        Proceder al pago seguro
      </button>
    </div>
  );
}
