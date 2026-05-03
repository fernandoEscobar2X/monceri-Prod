"use client";

import type { RefObject } from "react";
import type { MotionValue } from "framer-motion";
import { ConfiguratorControls } from "./configurator-controls";
import { ConfiguratorPreview } from "./configurator-preview";
import type {
  EnvironmentOption,
  FontOption,
  NeonColor,
  PreviewWord,
  PriceBreakdownItem,
  SizeOption,
} from "./configurator-types";

type ConfiguratorProps = {
  activeColorId: string;
  activeWordLabel: string;
  addOnCount: number;
  addToCartLabel: string;
  calculatedPrice: number;
  currentLineCount: number;
  dimmerAvailable: boolean;
  editableWordTokens: string[];
  effectiveDimmerEnabled: boolean;
  environmentOptions: EnvironmentOption[];
  fontOptions: FontOption[];
  hasValidationError: boolean;
  isConfigurationValid: boolean;
  isMobileLayout: boolean;
  isPreviewDraggable: boolean;
  letterCount: number;
  neonColors: NeonColor[];
  nfcEnabled: boolean;
  normalizedPhrase: string;
  onAddToCart: () => void;
  onDimmerChange: (enabled: boolean) => void;
  onNfcChange: (enabled: boolean) => void;
  onPhraseChange: (value: string) => void;
  onResetPreview: () => void;
  onSelectActiveWord: (index: number) => void;
  onSelectEnvironment: (environmentId: string) => void;
  onSelectFont: (font: FontOption) => void;
  onSelectSize: (size: SizeOption) => void;
  onUpdateActiveWordColor: (colorId: string) => void;
  onWaterproofChange: (enabled: boolean) => void;
  onZoomPreview: (direction: "in" | "out") => void;
  phrase: string;
  previewBoundsRef: RefObject<HTMLDivElement | null>;
  previewLinesWithColors: PreviewWord[][];
  previewScale: number;
  previewSignMaxWidth: string;
  previewX: MotionValue<number>;
  previewY: MotionValue<number>;
  priceBreakdown: PriceBreakdownItem[];
  priceDelta: number;
  resolvedWordColorIds: string[];
  safeActiveWordIndex: number;
  selectedAddOnLabels: string[];
  selectedEnvironment: EnvironmentOption;
  selectedEnvironmentId: string;
  selectedFont: FontOption;
  selectedSize: SizeOption;
  sizeOptions: SizeOption[];
  validationMessage: string;
  waterproofEnabled: boolean;
};

export function Configurator({
  activeColorId,
  activeWordLabel,
  addOnCount,
  addToCartLabel,
  calculatedPrice,
  currentLineCount,
  dimmerAvailable,
  editableWordTokens,
  effectiveDimmerEnabled,
  environmentOptions,
  fontOptions,
  hasValidationError,
  isConfigurationValid,
  isMobileLayout,
  isPreviewDraggable,
  letterCount,
  neonColors,
  nfcEnabled,
  normalizedPhrase,
  onAddToCart,
  onDimmerChange,
  onNfcChange,
  onPhraseChange,
  onResetPreview,
  onSelectActiveWord,
  onSelectEnvironment,
  onSelectFont,
  onSelectSize,
  onUpdateActiveWordColor,
  onWaterproofChange,
  onZoomPreview,
  phrase,
  previewBoundsRef,
  previewLinesWithColors,
  previewScale,
  previewSignMaxWidth,
  previewX,
  previewY,
  priceBreakdown,
  priceDelta,
  resolvedWordColorIds,
  safeActiveWordIndex,
  selectedAddOnLabels,
  selectedEnvironment,
  selectedEnvironmentId,
  selectedFont,
  selectedSize,
  sizeOptions,
  validationMessage,
  waterproofEnabled,
}: ConfiguratorProps) {
  return (
    <section id="configurador" className="border-b border-gray-200 bg-white">
      <div className="grid lg:items-start lg:grid-cols-[1.08fr_0.92fr]">
        <ConfiguratorPreview
          environmentOptions={environmentOptions}
          isMobileLayout={isMobileLayout}
          isPreviewDraggable={isPreviewDraggable}
          normalizedPhrase={normalizedPhrase}
          onResetPreview={onResetPreview}
          onSelectEnvironment={onSelectEnvironment}
          onZoomPreview={onZoomPreview}
          previewBoundsRef={previewBoundsRef}
          previewLinesWithColors={previewLinesWithColors}
          previewScale={previewScale}
          previewSignMaxWidth={previewSignMaxWidth}
          previewX={previewX}
          previewY={previewY}
          selectedEnvironment={selectedEnvironment}
          selectedEnvironmentId={selectedEnvironmentId}
          selectedFont={selectedFont}
          selectedSize={selectedSize}
        />
        <ConfiguratorControls
          activeColorId={activeColorId}
          activeWordLabel={activeWordLabel}
          addOnCount={addOnCount}
          addToCartLabel={addToCartLabel}
          calculatedPrice={calculatedPrice}
          currentLineCount={currentLineCount}
          dimmerAvailable={dimmerAvailable}
          editableWordTokens={editableWordTokens}
          effectiveDimmerEnabled={effectiveDimmerEnabled}
          fontOptions={fontOptions}
          hasValidationError={hasValidationError}
          isConfigurationValid={isConfigurationValid}
          letterCount={letterCount}
          neonColors={neonColors}
          nfcEnabled={nfcEnabled}
          onAddToCart={onAddToCart}
          onDimmerChange={onDimmerChange}
          onNfcChange={onNfcChange}
          onPhraseChange={onPhraseChange}
          onSelectActiveWord={onSelectActiveWord}
          onSelectFont={onSelectFont}
          onSelectSize={onSelectSize}
          onUpdateActiveWordColor={onUpdateActiveWordColor}
          onWaterproofChange={onWaterproofChange}
          phrase={phrase}
          priceBreakdown={priceBreakdown}
          priceDelta={priceDelta}
          resolvedWordColorIds={resolvedWordColorIds}
          safeActiveWordIndex={safeActiveWordIndex}
          selectedAddOnLabels={selectedAddOnLabels}
          selectedFont={selectedFont}
          selectedSize={selectedSize}
          sizeOptions={sizeOptions}
          validationMessage={validationMessage}
          waterproofEnabled={waterproofEnabled}
        />
      </div>
    </section>
  );
}
