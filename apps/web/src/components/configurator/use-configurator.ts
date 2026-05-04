"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import type { ConfiguratorAddon } from "@monceri/shared";
import { calculateNeonPrice, countConfiguratorLetters } from "@monceri/shared";
import type { ConfiguratorProps } from "./configurator";
import type { NeonColor } from "./configurator-types";
import {
  environmentOptions,
  fontOptions,
  neonColors,
  sizeOptions,
} from "@/lib/data/configurator-data";
import { formatPrice } from "@/lib/formatters/price";
import { useCartStore } from "@/stores/cart";

const minimumCharacters = 3;
const defaultSizeOption = sizeOptions.find((size) => size.id === "65cm") ?? sizeOptions[0];

function sanitizePhraseInput(value: string) {
  return value.replace(/\r/g, "").split("\n").slice(0, 3).join("\n");
}

function getNeonColorOption(colorId: string) {
  return neonColors.find((color) => color.id === colorId) ?? neonColors[0];
}

function getColorSummary(selectedColorOptions: NeonColor[]) {
  const uniqueColorIds = Array.from(new Set(selectedColorOptions.map((color) => color.id)));

  if (uniqueColorIds.length === 1 && !selectedColorOptions[0]?.isMulticolor) {
    return selectedColorOptions[0]?.label ?? "Rojo";
  }

  return "Multicolor personalizado";
}

type UseConfiguratorArgs = {
  isMobileLayout: boolean;
  isPreviewDraggable: boolean;
  onAddedToCart: () => void;
};

export function useConfigurator({
  isMobileLayout,
  isPreviewDraggable,
  onAddedToCart,
}: UseConfiguratorArgs): ConfiguratorProps & {
  hasTypedText: boolean;
  setSuggestedPhrase: (phrase: string) => void;
} {
  const addItem = useCartStore((state) => state.addItem);
  const previewBoundsRef = useRef<HTMLDivElement | null>(null);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const [phrase, setPhrase] = useState("Monceri");
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
  const [selectedSize, setSelectedSize] = useState(defaultSizeOption);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState(environmentOptions[0].id);
  const [previewScale, setPreviewScale] = useState(1);
  const [wordColorIds, setWordColorIds] = useState<string[]>(["red"]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [dimmerEnabled, setDimmerEnabled] = useState(false);
  const [waterproofEnabled, setWaterproofEnabled] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const initialPrice = selectedSize.basePrice;
  const previousPriceRef = useRef(initialPrice);
  const hasAnimatedPriceRef = useRef(false);
  const [priceDelta, setPriceDelta] = useState(0);

  const sanitizedPhrase = sanitizePhraseInput(phrase);
  const phraseLines = sanitizedPhrase
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const currentLineCount = phraseLines.length;
  const lineLetterCounts = phraseLines.map((line) => countConfiguratorLetters(line));
  const firstOverflowLineIndex = lineLetterCounts.findIndex(
    (count) => count > selectedSize.maxLettersPerLine,
  );
  const hasLineLengthError = firstOverflowLineIndex >= 0;
  const hasLineCountError = currentLineCount > selectedSize.maxLines;
  const letterCount = countConfiguratorLetters(phraseLines.join(""));
  const maxLetterCount = selectedSize.maxLettersPerLine;
  const hasTotalLengthError = letterCount > maxLetterCount;
  const isBelowMinimumCharacters = letterCount > 0 && letterCount < minimumCharacters;
  const hasTypedText = phrase.trim().length > 0;
  const isConfigurationValid =
    currentLineCount > 0 &&
    letterCount >= minimumCharacters &&
    !hasLineCountError &&
    !hasTotalLengthError &&
    !hasLineLengthError;
  const normalizedPhrase = phraseLines.join("\n") || "Tu frase";
  const previewWordMatrix =
    phraseLines.length > 0
      ? phraseLines.map((line) => line.split(/\s+/).filter(Boolean))
      : [["Tu frase"]];
  const editableWordTokens =
    phraseLines.length > 0 ? phraseLines.flatMap((line) => line.split(/\s+/).filter(Boolean)) : ["Tu frase"];
  const displayWordCount = editableWordTokens.length;
  const resolvedWordColorIds = Array.from(
    { length: displayWordCount },
    (_, index) => wordColorIds[index] ?? neonColors[0].id,
  );
  const safeActiveWordIndex = Math.min(activeWordIndex, displayWordCount - 1);
  const activeColorId = resolvedWordColorIds[safeActiveWordIndex] ?? neonColors[0].id;
  const activeWordLabel = editableWordTokens[safeActiveWordIndex] ?? editableWordTokens[0];
  const dimmerAvailable = selectedSize.widthCm <= 70;
  const effectiveDimmerEnabled = dimmerEnabled && dimmerAvailable;
  const addons: ConfiguratorAddon[] = [
    effectiveDimmerEnabled ? "dimmer" : null,
    waterproofEnabled ? "waterproof" : null,
    nfcEnabled ? "nfc" : null,
  ].filter((addon): addon is ConfiguratorAddon => Boolean(addon));
  const price = isConfigurationValid
    ? calculateNeonPrice({ addons, phrase: normalizedPhrase, size: selectedSize })
    : { base: 0, lettering: 0, dimmer: 0, waterproof: 0, nfc: 0, total: 0 };
  const addOnCount = addons.length;
  const selectedColorOptions = resolvedWordColorIds.map((colorId) => getNeonColorOption(colorId));
  const previewLinesWithColors = previewWordMatrix.map((lineWords, lineIndex) => {
    const colorOffset = previewWordMatrix
      .slice(0, lineIndex)
      .reduce((total, currentLine) => total + currentLine.length, 0);

    return lineWords.map((word, wordIndex) => ({
      label: word,
      colorId: resolvedWordColorIds[colorOffset + wordIndex] ?? neonColors[0].id,
    }));
  });
  const selectedAddOnLabels = [
    effectiveDimmerEnabled ? "Control remoto Dimmer" : null,
    waterproofEnabled ? "Waterproof exterior" : null,
    nfcEnabled ? "Tecnologia NFC" : null,
  ].filter((item): item is string => Boolean(item));
  const hasValidationError =
    hasLineCountError ||
    hasTotalLengthError ||
    hasLineLengthError ||
    isBelowMinimumCharacters ||
    !hasTypedText;
  const addToCartLabel = !hasTypedText || isBelowMinimumCharacters
    ? "Completa minimo 3 caracteres"
    : hasLineCountError || hasTotalLengthError || hasLineLengthError
      ? "Corrige la configuracion para continuar"
      : `Agregar al carrito - ${formatPrice(price.total)}`;
  const priceBreakdown = [
    { label: `Base ${selectedSize.width}`, value: price.base },
    { label: `Texto incluido (${letterCount} letras)`, value: price.lettering },
    { label: "Control remoto Dimmer", value: price.dimmer },
    { label: "Waterproof exterior", value: price.waterproof },
    { label: "Tecnologia NFC", value: price.nfc },
  ];
  const validationMessage = hasLineCountError
    ? `Esta medida admite hasta ${selectedSize.maxLines} renglones.`
    : hasTotalLengthError
      ? `El texto excede el limite de letras del tamano seleccionado (${letterCount}/${maxLetterCount}).`
    : hasLineLengthError
      ? `El renglon ${firstOverflowLineIndex + 1} supera el maximo de ${selectedSize.maxLettersPerLine} letras para esta medida.`
      : isBelowMinimumCharacters
        ? "Se requieren 3 o mas caracteres para este tamano. Agrega mas texto para continuar."
        : !hasTypedText
          ? "Escribe tu texto y el simulador cotizara en tiempo real."
          : isPreviewDraggable
            ? "El texto se ajusta al ambiente y puedes moverlo dentro de la zona de montaje."
            : "En movil el preview se centra automaticamente para priorizar lectura, scroll y compra.";
  const selectedEnvironment =
    environmentOptions.find((environment) => environment.id === selectedEnvironmentId) ??
    environmentOptions[0];

  useEffect(() => {
    if (isMobileLayout) {
      animate(previewX, 0, { duration: 0.2 });
      animate(previewY, 0, { duration: 0.2 });
    }
  }, [isMobileLayout, previewX, previewY]);

  useEffect(() => {
    const nextDelta = price.total - previousPriceRef.current;

    if (hasAnimatedPriceRef.current) {
      setPriceDelta(nextDelta);
    }

    previousPriceRef.current = price.total;
    hasAnimatedPriceRef.current = true;
  }, [price.total]);

  useEffect(() => {
    if (priceDelta === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPriceDelta(0);
    }, 1500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [priceDelta]);

  function resetPreview() {
    animate(previewX, 0, { duration: 0.25 });
    animate(previewY, 0, { duration: 0.25 });
    setPreviewScale(1);
  }

  function zoomPreview(direction: "in" | "out") {
    setPreviewScale((currentScale) => {
      const nextScale = direction === "in" ? currentScale + 0.1 : currentScale - 0.1;
      return Number(Math.min(1.35, Math.max(0.8, nextScale)).toFixed(2));
    });
  }

  function updateActiveWordColor(colorId: string) {
    setWordColorIds((currentColors) => {
      const nextColors = [...currentColors];
      nextColors[safeActiveWordIndex] = colorId;
      return nextColors;
    });
  }

  function addToCart() {
    if (!isConfigurationValid) {
      return;
    }

    const itemId = [
      selectedFont.id,
      selectedSize.id,
      normalizedPhrase,
      resolvedWordColorIds.join("."),
      effectiveDimmerEnabled ? "d1" : "d0",
      waterproofEnabled ? "w1" : "w0",
      nfcEnabled ? "n1" : "n0",
    ].join("|");

    addItem({
      type: "CONFIGURATOR",
      id: itemId,
      phrase: normalizedPhrase,
      fontName: selectedFont.label,
      sizeLabel: `${selectedSize.width} / aprox. ${selectedSize.height}`,
      lineCount: currentLineCount,
      colorLabel: getColorSummary(selectedColorOptions),
      addOns: selectedAddOnLabels,
      price: price.total,
      qty: 1,
      configuration: {
        phrase: normalizedPhrase,
        fontId: selectedFont.id,
        sizeId: selectedSize.id,
        colorIds: resolvedWordColorIds,
        addons,
      },
    });
    onAddedToCart();
  }

  return {
    activeColorId,
    activeWordLabel,
    addOnCount,
    addToCartLabel,
    calculatedPrice: price.total,
    currentLineCount,
    dimmerAvailable,
    editableWordTokens,
    effectiveDimmerEnabled,
    environmentOptions,
    fontOptions,
    hasTypedText,
    hasValidationError,
    isConfigurationValid,
    isMobileLayout,
    isPreviewDraggable,
    letterCount,
    neonColors,
    nfcEnabled,
    normalizedPhrase,
    onAddToCart: addToCart,
    onDimmerChange: setDimmerEnabled,
    onNfcChange: setNfcEnabled,
    onPhraseChange: (value) => setPhrase(sanitizePhraseInput(value)),
    onResetPreview: resetPreview,
    onSelectActiveWord: setActiveWordIndex,
    onSelectEnvironment: setSelectedEnvironmentId,
    onSelectFont: setSelectedFont,
    onSelectSize: setSelectedSize,
    onUpdateActiveWordColor: updateActiveWordColor,
    onWaterproofChange: setWaterproofEnabled,
    onZoomPreview: zoomPreview,
    phrase,
    previewBoundsRef,
    previewLinesWithColors,
    previewScale,
    previewSignMaxWidth: selectedSize.previewMaxWidth,
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
    setSuggestedPhrase: (value) => {
      if (!hasTypedText) {
        setPhrase(sanitizePhraseInput(value));
      }
    },
    sizeOptions,
    validationMessage,
    waterproofEnabled,
  };
}
