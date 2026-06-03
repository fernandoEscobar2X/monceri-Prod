"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import type { PriceBreakdownItem } from "./configurator-types";
import { formatPrice } from "@/lib/formatters/price";

type AnimatedPriceCounterProps = {
  className?: string;
  durationMs?: number;
  value: number;
};

function AnimatedPriceCounter({
  className,
  durationMs = 180,
  value,
}: AnimatedPriceCounterProps) {
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const motionValue = useMotionValue(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: durationMs / 1000,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (counterRef.current) {
          counterRef.current.textContent = formatPrice(Math.round(latest));
        }
      },
    });

    return () => {
      controls.stop();
    };
  }, [durationMs, motionValue, value]);

  return (
    <span
      ref={counterRef}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums lining-nums" }}
      suppressHydrationWarning
    >
      {formatPrice(value)}
    </span>
  );
}

type ConfiguratorSummaryProps = {
  addOnCount: number;
  calculatedPrice: number;
  hasValidationError: boolean;
  letterCount: number;
  priceBreakdown: PriceBreakdownItem[];
  priceDelta: number;
  selectedAddOnLabels: string[];
  selectedSizeBasePrice: number;
  validationMessage: string;
};

export function ConfiguratorSummary({
  addOnCount,
  calculatedPrice,
  hasValidationError,
  letterCount,
  priceBreakdown,
  priceDelta,
  selectedAddOnLabels,
  selectedSizeBasePrice,
  validationMessage,
}: ConfiguratorSummaryProps) {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-[#111827] px-6 py-6 text-white shadow-[0_28px_60px_rgba(17,24,39,0.2)] sm:px-7 sm:py-7">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.14)_0%,transparent_30%),radial-gradient(circle_at_88%_24%,rgba(230,57,70,0.26)_0%,transparent_28%),linear-gradient(135deg,rgba(11,15,20,1)_0%,rgba(17,24,39,1)_55%,rgba(74,11,19,0.96)_100%)]"
        animate={{ opacity: [0.9, 1, 0.9], scale: [1, 1.02, 1] }}
        transition={{ duration: 4.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-12 top-6 h-32 w-32 rounded-full bg-[#E63946]/28 blur-3xl"
        animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
        transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
              Precio estimado
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <AnimatedPriceCounter
                value={calculatedPrice}
                durationMs={160}
                className="font-display text-5xl font-black tracking-tight sm:text-7xl"
              />

              <AnimatePresence>
                {priceDelta !== 0 ? (
                  <motion.span
                    initial={{ opacity: 0, y: 8, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.94 }}
                    transition={{ duration: 0.25 }}
                    className={`mb-2 inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                      priceDelta > 0
                        ? "bg-[#E63946]/18 text-[#FFD9DE]"
                        : "bg-emerald-500/16 text-emerald-100"
                    }`}
                  >
                    {priceDelta > 0 ? "+" : "-"} {formatPrice(Math.abs(priceDelta))}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
            <p className="mt-2 text-sm text-white/68">IVA incluido</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-right text-sm text-white/68">
            <div>Letras: {letterCount}</div>
            <div>Base: {formatPrice(selectedSizeBasePrice)}</div>
            <div>Extras activos: {addOnCount}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {priceBreakdown.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm"
            >
              <span className="text-white/70">{item.label}</span>
              <span className="font-semibold text-white">{formatPrice(item.value)}</span>
            </div>
          ))}
        </div>

        {hasValidationError ? (
          <p className="mt-5 text-sm font-medium text-[#FFD9DE]">{validationMessage}</p>
        ) : (
          <p className="mt-5 text-sm text-white/72">
            {selectedAddOnLabels.length > 0
              ? `Extras activos: ${selectedAddOnLabels.join(", ")}.`
              : "Configura extras opcionales para ajustar tu precio final."}
          </p>
        )}
      </div>
    </div>
  );
}
