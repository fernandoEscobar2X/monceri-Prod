"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { CheckoutCustomerInput, CreateOrderInput, WhatsappOrderResponse } from "@monceri/shared";
import { CheckoutCustomerSchema } from "@monceri/shared";
import { CartSummary } from "./cart-summary";
import { ApiRequestError, apiRequest, getApiErrorMessage } from "@/lib/api-client";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { useCartStore } from "@/stores/cart";

type CheckoutFormProps = {
  shipping: number;
  subtotal: number;
  total: number;
  onClose: () => void;
};

export function CheckoutForm({ shipping, subtotal, total, onClose }: CheckoutFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<CheckoutCustomerInput>({
    defaultValues: {
      couponCode: "",
      customerEmail: "",
      customerName: "",
      customerPhone: "",
    },
    resolver: zodResolver(CheckoutCustomerSchema),
  });

  async function submitOrder(values: CheckoutCustomerInput) {
    if (items.length === 0) {
      return;
    }

    setSubmitError(null);

    const payload: CreateOrderInput = {
      customerName: values.customerName.trim(),
      customerPhone: values.customerPhone.trim(),
      customerEmail: values.customerEmail?.trim() || "",
      couponCode: values.couponCode?.trim() || undefined,
      items: items.map((item) => {
        if (item.type === "CONFIGURATOR") {
          return {
            type: "CONFIGURATOR",
            quantity: item.qty,
            configuration: item.configuration,
          };
        }

        return {
          type: "PRODUCT",
          productId: item.productId,
          quantity: item.qty,
          variants: item.variants,
        };
      }),
    };

    try {
      const order = await apiRequest<WhatsappOrderResponse>("/api/orders", {
        body: JSON.stringify(payload),
        method: "POST",
      });

      window.open(
        buildWhatsAppHref(order.whatsappMessage, process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
        "_blank",
        "noopener,noreferrer",
      );

      await apiRequest<unknown>(`/api/orders/${order.orderNumber}/mark-sent`, {
        method: "POST",
      });

      clearCart();
      onClose();
    } catch (error) {
      setSubmitError(error instanceof ApiRequestError ? getApiErrorMessage(error) : "No se pudo crear el pedido.");
    }
  }

  return (
    <form onSubmit={handleSubmit(submitOrder)}>
      <CartSummary shipping={shipping} subtotal={subtotal} total={total}>
        <div className="mt-5 grid gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400" htmlFor="customerName">
              Nombre
            </label>
            <input
              id="customerName"
              className="mt-2 h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-[#111827] outline-none transition focus:border-[#E63946]"
              autoComplete="name"
              {...register("customerName")}
            />
            {errors.customerName ? <p className="mt-1 text-xs text-[#B42318]">{errors.customerName.message}</p> : null}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400" htmlFor="customerPhone">
              Telefono
            </label>
            <input
              id="customerPhone"
              className="mt-2 h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-[#111827] outline-none transition focus:border-[#E63946]"
              autoComplete="tel"
              {...register("customerPhone")}
            />
            {errors.customerPhone ? <p className="mt-1 text-xs text-[#B42318]">{errors.customerPhone.message}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400" htmlFor="customerEmail">
                Email opcional
              </label>
              <input
                id="customerEmail"
                className="mt-2 h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-[#111827] outline-none transition focus:border-[#E63946]"
                autoComplete="email"
                {...register("customerEmail")}
              />
              {errors.customerEmail ? (
                <p className="mt-1 text-xs text-[#B42318]">{errors.customerEmail.message}</p>
              ) : null}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400" htmlFor="couponCode">
                Cupon
              </label>
              <input
                id="couponCode"
                className="mt-2 h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium uppercase text-[#111827] outline-none transition focus:border-[#E63946]"
                autoComplete="off"
                {...register("couponCode")}
              />
              {errors.couponCode ? <p className="mt-1 text-xs text-[#B42318]">{errors.couponCode.message}</p> : null}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-[#009EE3]" />
            <span>Pedido por WhatsApp</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#E63946]" />
            <span>Garantia de fabricacion</span>
          </div>
        </div>

        {submitError ? (
          <div className="mt-4 rounded-2xl border border-[#E63946]/20 bg-[#FFF1F3] px-4 py-3 text-sm text-[#B42318]">
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={items.length === 0 || isSubmitting}
          className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#E63946] px-5 text-base font-bold text-white shadow-[0_18px_34px_rgba(230,57,70,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[#F29AA3] disabled:shadow-none"
        >
          {isSubmitting ? "Creando pedido..." : "Pedir por WhatsApp"}
        </button>
      </CartSummary>
    </form>
  );
}
