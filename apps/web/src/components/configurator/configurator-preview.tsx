"use client";

import type { RefObject } from "react";
import dynamic from "next/dynamic";
import { animate, motion, type MotionValue } from "framer-motion";
import { Minus, Move, Plus, RefreshCw, Sparkles } from "lucide-react";
import type { EnvironmentOption, FontOption, PreviewWord, SizeOption } from "./configurator-types";

const NeonShowroomCanvas = dynamic(() => import("@/components/neon-preview/neon-showroom-canvas"), {
  ssr: false,
});

type ConfiguratorPreviewProps = {
  environmentOptions: EnvironmentOption[];
  isMobileLayout: boolean;
  isPreviewDraggable: boolean;
  normalizedPhrase: string;
  onResetPreview: () => void;
  onSelectEnvironment: (environmentId: string) => void;
  onZoomPreview: (direction: "in" | "out") => void;
  previewBoundsRef: RefObject<HTMLDivElement | null>;
  previewLinesWithColors: PreviewWord[][];
  previewScale: number;
  previewSignMaxWidth: string;
  previewX: MotionValue<number>;
  previewY: MotionValue<number>;
  selectedEnvironment: EnvironmentOption;
  selectedEnvironmentId: string;
  selectedFont: FontOption;
  selectedSize: SizeOption;
};

export function ConfiguratorPreview({
  environmentOptions,
  isMobileLayout,
  isPreviewDraggable,
  normalizedPhrase,
  onResetPreview,
  onSelectEnvironment,
  onZoomPreview,
  previewBoundsRef,
  previewLinesWithColors,
  previewScale,
  previewSignMaxWidth,
  previewX,
  previewY,
  selectedEnvironment,
  selectedEnvironmentId,
  selectedFont,
  selectedSize,
}: ConfiguratorPreviewProps) {
  const previewSign = (
    <>
      <div className="relative w-full px-3 py-2 sm:px-4 sm:py-3">
        <div className="pointer-events-none absolute -left-14 top-1/2 hidden -translate-y-1/2 items-center gap-2 lg:flex">
          <div className="relative h-24 w-5">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/40" />
            <span className="absolute left-0 top-0 h-px w-full bg-white/40" />
            <span className="absolute left-0 bottom-0 h-px w-full bg-white/40" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-white/72">{selectedSize.height}</span>
        </div>

        <div className="relative h-[164px] w-full sm:h-[182px] lg:h-[214px]">
          <NeonShowroomCanvas
            key={`${selectedFont.id}-${selectedSize.id}-${normalizedPhrase}`}
            lines={previewLinesWithColors}
            fontId={selectedFont.id}
            fitBias={selectedFont.fitBias}
            isMobile={isMobileLayout}
            widthCm={selectedSize.widthCm}
          />
        </div>
      </div>
      <div className="mt-7 flex w-full items-center justify-between border-t border-white/30 pt-2 text-[10px] font-bold tracking-widest text-white/50">
        <span>|</span>
        <span>APROX. {selectedSize.width}</span>
        <span>|</span>
      </div>
    </>
  );

  return (
    <div className="relative h-[420px] overflow-hidden bg-[#0B0F14] sm:h-[520px] lg:sticky lg:top-24 lg:h-[min(820px,calc(100vh-7rem))] lg:self-start">
      <div className="absolute inset-0" style={selectedEnvironment.style} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.05)_40%,rgba(0,0,0,0.68)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(230,57,70,0.18)_0%,transparent_28%)]" />

      <div className="relative z-10 flex h-full flex-col justify-between px-4 py-5 sm:px-10 sm:py-10 lg:px-12">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
            <Sparkles className="size-4 text-[#E63946]" />
            Simulador en ambiente real
          </div>

          <div className="hidden items-center gap-2 border border-white/12 bg-black/24 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-sm sm:inline-flex">
            <Move className="size-3.5" />
            Arrastra el letrero
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {environmentOptions.map((environment) => {
            const isActive = environment.id === selectedEnvironmentId;

            return (
              <button
                key={environment.id}
                type="button"
                onClick={() => {
                  onSelectEnvironment(environment.id);
                  onResetPreview();
                }}
                className={`min-w-[120px] flex-1 border px-3 py-2 text-left backdrop-blur-sm transition sm:flex-none ${
                  isActive
                    ? "border-white/45 bg-white/18 text-white"
                    : "border-white/12 bg-black/18 text-white/72 hover:border-white/25"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {environment.label}
                </div>
                <div className="mt-1 text-[11px] text-white/72">{environment.helper}</div>
              </button>
            );
          })}

          <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => onZoomPreview("out")}
              className="inline-flex size-10 items-center justify-center border border-white/12 bg-black/24 text-white transition hover:border-white/28"
              aria-label="Alejar preview"
            >
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              onClick={onResetPreview}
              className="inline-flex h-10 items-center justify-center gap-2 border border-white/12 bg-black/24 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white/28"
            >
              <RefreshCw className="size-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => onZoomPreview("in")}
              className="inline-flex size-10 items-center justify-center border border-white/12 bg-black/24 text-white transition hover:border-white/28"
              aria-label="Acercar preview"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[220px] flex-1">
          <div ref={previewBoundsRef} className="absolute inset-0 flex items-center justify-center">
            {isPreviewDraggable ? (
              <motion.div
                drag
                dragConstraints={previewBoundsRef}
                dragElastic={0.04}
                dragMomentum={false}
                onDragEnd={() => {
                  if (Math.abs(previewX.get()) < 18) {
                    animate(previewX, 0, { duration: 0.18 });
                  }
                  if (Math.abs(previewY.get()) < 18) {
                    animate(previewY, 0, { duration: 0.18 });
                  }
                }}
                className="absolute left-1/2 top-1/2 z-10 flex w-[72%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center sm:w-[52%] lg:w-[46%] cursor-grab active:cursor-grabbing"
                style={{
                  maxWidth: previewSignMaxWidth,
                  x: previewX,
                  y: previewY,
                  scale: previewScale,
                  touchAction: "none",
                }}
              >
                {previewSign}
              </motion.div>
            ) : (
              <div
                className="relative z-10 flex w-[72%] flex-col items-center text-center sm:w-[52%] lg:w-[46%]"
                style={{
                  maxWidth: previewSignMaxWidth,
                  pointerEvents: "none",
                  transform: `scale(${previewScale})`,
                }}
              >
                {previewSign}
              </div>
            )}
          </div>
        </div>

        <div
          className="no-scrollbar -mb-1 flex gap-3 overflow-x-auto pb-1 pr-4 snap-x snap-mandatory sm:mb-0 sm:grid sm:max-w-xl sm:grid-cols-3 sm:overflow-visible sm:pb-0 sm:pr-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {[
            "Preview fotorealista",
            `${selectedSize.maxLettersPerLine} letras max. por renglon`,
            isPreviewDraggable ? "Drag con zona de montaje" : "Preview centrado para movil",
          ].map((item) => (
            <div
              key={item}
              className="min-w-[190px] snap-start border border-white/12 bg-black/24 px-4 py-4 text-left text-sm font-medium text-white/92 backdrop-blur-[2px] sm:min-w-0"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
