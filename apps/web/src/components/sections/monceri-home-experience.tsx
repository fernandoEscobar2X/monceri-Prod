"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import { CartDrawer, type CartItem } from "@/components/cart/cart-drawer";
import { Configurator } from "@/components/configurator/configurator";
import type {
  EnvironmentOption,
  FontOption,
  NeonColor,
  SizeOption,
} from "@/components/configurator/configurator-types";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter, type PaymentMethod } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CasesSection } from "@/components/sections/cases-section";
import { ConfiguratorPreviewSection } from "@/components/sections/configurator-preview-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductLinesSection } from "@/components/sections/product-lines-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { formatPrice } from "@/lib/formatters/price";

type ProductCard = {
  name: string;
  category: string;
  price: number;
  image: string;
};

type ReviewCard = {
  name: string;
  city: string;
  quote: string;
  image: string;
  heightClassName: string;
};

const fontOptions: FontOption[] = [
  {
    id: "electric-1",
    label: "Electric 1",
    previewFamily: '"Monceri Electric 1", cursive',
    previewClassName: "font-normal tracking-[-0.03em]",
    fitBias: 0.08,
  },
  {
    id: "electric-2",
    label: "Electric 2",
    previewFamily: '"Monceri Electric 2", cursive',
    previewClassName: "font-normal tracking-[-0.035em]",
    fitBias: 0.1,
  },
  {
    id: "electric-3",
    label: "Electric 3",
    previewFamily: '"Monceri Electric 3", cursive',
    previewClassName: "font-normal tracking-[-0.03em]",
    fitBias: 0.1,
  },
  {
    id: "electric-4",
    label: "Electric 4",
    previewFamily: '"Monceri Electric 4", serif',
    previewClassName: "font-normal tracking-[-0.025em]",
    fitBias: 0.08,
  },
  {
    id: "electric-5",
    label: "Electric 5",
    previewFamily: '"Monceri Electric 5", serif',
    previewClassName: "font-normal tracking-[-0.02em]",
    fitBias: 0.08,
  },
  {
    id: "electric-6",
    label: "Electric 6",
    previewFamily: '"Monceri Electric 6", serif',
    previewClassName: "font-normal tracking-[-0.055em]",
    fitBias: 0.15,
  },
  {
    id: "electric-7",
    label: "Electric 7",
    previewFamily: '"Monceri Electric 7", sans-serif',
    previewClassName: "font-normal tracking-[-0.015em]",
    fitBias: 0.05,
  },
  {
    id: "electric-8",
    label: "Electric 8",
    previewFamily: '"Monceri Electric 8", sans-serif',
    previewClassName: "font-normal uppercase tracking-[0.045em]",
    fitBias: 0.05,
  },
  {
    id: "electric-9",
    label: "Electric 9",
    previewFamily: '"Monceri Electric 9", sans-serif',
    previewClassName: "font-black uppercase tracking-[0.03em]",
    fitBias: 0.05,
  },
  {
    id: "electric-10",
    label: "Electric 10",
    previewFamily: '"Monceri Electric 10", monospace',
    previewClassName: "font-normal tracking-[0.015em]",
    fitBias: 0.06,
  },
  {
    id: "electric-11",
    label: "Electric 11",
    previewFamily: '"Monceri Electric 11", sans-serif',
    previewClassName: "font-normal lowercase tracking-[0.02em]",
    fitBias: 0.04,
  },
];

const sizeOptions: SizeOption[] = [
  {
    id: "50cm",
    label: "50cm",
    width: "50cm",
    widthCm: 50,
    height: "12cm",
    maxLettersPerLine: 8,
    maxLines: 2,
    basePrice: 950,
    perCharacterPrice: 50,
    previewMaxWidth: "320px",
    singleLineClassName: "text-[2.2rem] sm:text-4xl xl:text-5xl",
    multiLineClassName: "text-[1.8rem] sm:text-3xl xl:text-4xl",
  },
  {
    id: "70cm",
    label: "70cm",
    width: "70cm",
    widthCm: 70,
    height: "16cm",
    maxLettersPerLine: 11,
    maxLines: 2,
    basePrice: 1290,
    perCharacterPrice: 55,
    previewMaxWidth: "360px",
    singleLineClassName: "text-[2.45rem] sm:text-5xl xl:text-6xl",
    multiLineClassName: "text-[1.95rem] sm:text-4xl xl:text-5xl",
  },
  {
    id: "90cm",
    label: "90cm",
    width: "90cm",
    widthCm: 90,
    height: "22cm",
    maxLettersPerLine: 13,
    maxLines: 2,
    basePrice: 1650,
    perCharacterPrice: 62,
    previewMaxWidth: "420px",
    singleLineClassName: "text-[2.65rem] sm:text-5xl xl:text-6xl",
    multiLineClassName: "text-[2.05rem] sm:text-4xl xl:text-5xl",
  },
  {
    id: "100cm",
    label: "100cm",
    width: "100cm",
    widthCm: 100,
    height: "25cm",
    maxLettersPerLine: 16,
    maxLines: 2,
    basePrice: 1890,
    perCharacterPrice: 68,
    previewMaxWidth: "450px",
    singleLineClassName: "text-[2.8rem] sm:text-5xl xl:text-6xl",
    multiLineClassName: "text-[2.15rem] sm:text-4xl xl:text-5xl",
  },
  {
    id: "120cm",
    label: "120cm",
    width: "120cm",
    widthCm: 120,
    height: "30cm",
    maxLettersPerLine: 18,
    maxLines: 2,
    basePrice: 2290,
    perCharacterPrice: 74,
    previewMaxWidth: "510px",
    singleLineClassName: "text-[3rem] sm:text-6xl xl:text-7xl",
    multiLineClassName: "text-[2.35rem] sm:text-5xl xl:text-6xl",
  },
  {
    id: "150cm",
    label: "150cm",
    width: "150cm",
    widthCm: 150,
    height: "38cm",
    maxLettersPerLine: 22,
    maxLines: 2,
    basePrice: 2990,
    perCharacterPrice: 86,
    previewMaxWidth: "580px",
    singleLineClassName: "text-[3.1rem] sm:text-6xl xl:text-7xl",
    multiLineClassName: "text-[2.5rem] sm:text-5xl xl:text-6xl",
  },
  {
    id: "200cm",
    label: "200cm",
    width: "200cm",
    widthCm: 200,
    height: "52cm",
    maxLettersPerLine: 30,
    maxLines: 2,
    basePrice: 3990,
    perCharacterPrice: 102,
    previewMaxWidth: "660px",
    singleLineClassName: "text-[3.3rem] sm:text-7xl xl:text-[5.5rem]",
    multiLineClassName: "text-[2.7rem] sm:text-6xl xl:text-7xl",
  },
];

const announcementItems = [
  "Envio GRATIS en pedidos mayores a $1,999 MXN",
  "Instalacion sencilla y asesoria directa",
  "Personaliza tu frase y visualizala al momento",
  "Produccion en Neon, Acrilico y MDF",
];

const categories = ["Letreros Neon", "Frases LED", "Corte Laser", "Acrilico 3D", "Empresas"];

const marqueeImages = [
  {
    title: "Hello Beautiful",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Open Late",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Stay Wild",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Bride to Be",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Cocktail Bar",
    image:
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Glow Corner",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
];

const suggestedProducts: ProductCard[] = [
  {
    name: "The Sarmiento's",
    category: "Neon para eventos",
    price: 6450,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Coffee Corner",
    category: "Negocio / cafeteria",
    price: 4890,
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Mon Amour",
    category: "Decoracion interior",
    price: 5320,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Open Late",
    category: "Bar / restaurante",
    price: 5980,
    image:
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?q=80&w=1200&auto=format&fit=crop",
  },
];

const reviewCards: ReviewCard[] = [
  {
    name: "Sofia R.",
    city: "Xalapa",
    quote: "El letrero se volvio parte del espacio y ahora todo mundo quiere tomarse foto ahi.",
    image: "/monceri-coffee-installation.png",
    heightClassName: "h-[320px] sm:h-[420px]",
  },
  {
    name: "Diego P.",
    city: "Veracruz",
    quote: "Lo usamos para el local y se volvio el punto mas fotografiado del negocio.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    heightClassName: "h-[320px] sm:h-[460px]",
  },
  {
    name: "Mariana G.",
    city: "Puebla",
    quote: "La pieza en acrilico se ve premium y la atencion fue super clara desde el inicio.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    heightClassName: "h-[300px] sm:h-[400px]",
  },
  {
    name: "Carlos M.",
    city: "CDMX",
    quote: "La calidad del brillo y el acabado hacen que se vea como una marca grande.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    heightClassName: "h-[360px] sm:h-[520px]",
  },
];

const showroomBackgroundStyle = {
  backgroundImage: "url('/monceri-brick-showroom.svg')",
} as const;

const simulatorPhotoBackgroundStyle = {
  backgroundImage: "url('/simulator-window-loft.png')",
} as const;

const heroInstallationStyle = {
  backgroundImage: "url('/monceri-hero-installation.jpg')",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
} as const;

const anatomyDetailStyle = {
  backgroundImage: "url('/monceri-anatomy-detail.jpg')",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
} as const;

const environmentOptions: EnvironmentOption[] = [
  {
    id: "lounge",
    label: "Sala urbana",
    helper: "Ambiente lifestyle",
    style: {
      ...simulatorPhotoBackgroundStyle,
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    },
  },
  {
    id: "showroom",
    label: "Showroom",
    helper: "Paneles premium",
    style: {
      ...showroomBackgroundStyle,
      backgroundPosition: "center 60%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 100%",
    },
  },
];

const promoBannerStyle = {
  background:
    "linear-gradient(135deg, #0B0F14 0%, #111827 50%, #4A0B13 100%)",
} as const;

const paymentMethods: PaymentMethod[] = [
  {
    id: "visa",
    label: "Visa",
    src: "/icons8-visa-48.png",
    slotWidth: 60,
    slotHeight: 24,
    badgeClassName: "min-w-[88px]",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    src: "/ma_symbol_opt_45_2x.png",
    slotWidth: 44,
    slotHeight: 32,
    badgeClassName: "min-w-[80px]",
  },
  {
    id: "oxxo",
    label: "OXXO",
    src: "/oxxo-logo-transparent.svg",
    slotWidth: 74,
    slotHeight: 24,
    badgeClassName: "min-w-[96px]",
  },
  {
    id: "mercado-pago",
    label: "Mercado Pago",
    src: "/MP_RGB_HANDSHAKE_color_horizontal.png",
    slotWidth: 124,
    slotHeight: 26,
    badgeClassName: "min-w-[148px]",
  },
];

const neonColors: NeonColor[] = [
  {
    id: "red",
    label: "Rojo",
    hex: "#ff2a2a",
    swatchBackground: "#ff2a2a",
  },
  {
    id: "white",
    label: "Blanco",
    hex: "#ffffff",
    swatchBackground: "#ffffff",
  },
  {
    id: "green",
    label: "Verde",
    hex: "#49ff15",
    swatchBackground: "#49ff15",
  },
  {
    id: "yellow",
    label: "Amarillo",
    hex: "#ffd400",
    swatchBackground: "#ffd400",
  },
  {
    id: "sky",
    label: "Azul cielo",
    hex: "#5ad8ff",
    swatchBackground: "#5ad8ff",
  },
  {
    id: "pink",
    label: "Rosa",
    hex: "#ff38b8",
    swatchBackground: "#ff38b8",
  },
  {
    id: "warm-white",
    label: "Warm white",
    hex: "#fff6ae",
    swatchBackground: "#fff6ae",
  },
  {
    id: "purple",
    label: "Morado",
    hex: "#931bff",
    swatchBackground: "#931bff",
  },
  {
    id: "orange",
    label: "Naranja",
    hex: "#ffa62b",
    swatchBackground: "#ffa62b",
  },
  {
    id: "blue",
    label: "Azul",
    hex: "#4625ff",
    swatchBackground: "#4625ff",
  },
  {
    id: "rainbow",
    label: "Multicolor",
    hex: "#ffffff",
    swatchBackground:
      "conic-gradient(from 180deg at 50% 50%, #ff2a2a 0deg, #ffd400 72deg, #49ff15 150deg, #5ad8ff 228deg, #4625ff 300deg, #ff38b8 360deg)",
    isMulticolor: true,
  },
];

function sanitizePhraseInput(value: string) {
  return value.replace(/\r/g, "").split("\n").slice(0, 3).join("\n");
}

function countLetters(value: string) {
  return value.replace(/\s+/g, "").length;
}

function roundToNearestTen(value: number) {
  return Math.round(value / 10) * 10;
}

function getNeonColorOption(colorId: string) {
  return neonColors.find((color) => color.id === colorId) ?? neonColors[0];
}

export function MonceriHomePrototype() {
  const previewBoundsRef = useRef<HTMLDivElement | null>(null);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [phrase, setPhrase] = useState("Monceri");
  const [selectedFont, setSelectedFont] = useState<FontOption>(fontOptions[0]);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(sizeOptions[0]);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState(environmentOptions[0].id);
  const [previewScale, setPreviewScale] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wordColorIds, setWordColorIds] = useState<string[]>(["red"]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [dimmerEnabled, setDimmerEnabled] = useState(false);
  const [waterproofEnabled, setWaterproofEnabled] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const initialPrice = sizeOptions[0].basePrice + countLetters("Monceri") * sizeOptions[0].perCharacterPrice;
  const previousPriceRef = useRef(initialPrice);
  const hasAnimatedPriceRef = useRef(false);
  const [priceDelta, setPriceDelta] = useState(0);

  const sanitizedPhrase = sanitizePhraseInput(phrase);
  const phraseLines = sanitizedPhrase
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const currentLineCount = phraseLines.length;
  const lineLetterCounts = phraseLines.map((line) => countLetters(line));
  const firstOverflowLineIndex = lineLetterCounts.findIndex(
    (count) => count > selectedSize.maxLettersPerLine,
  );
  const hasLineLengthError = firstOverflowLineIndex >= 0;
  const hasLineCountError = currentLineCount > selectedSize.maxLines;
  const letterCount = countLetters(phraseLines.join(""));
  const minimumCharacters = 3;
  const isBelowMinimumCharacters = letterCount > 0 && letterCount < minimumCharacters;
  const hasTypedText = phrase.trim().length > 0;
  const isConfigurationValid =
    currentLineCount > 0 &&
    letterCount >= minimumCharacters &&
    !hasLineCountError &&
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
  const previewSignMaxWidth = selectedSize.previewMaxWidth;
  const dimmerAvailable = selectedSize.widthCm <= 70;
  const effectiveDimmerEnabled = dimmerEnabled && dimmerAvailable;
  const baseSignPrice = isConfigurationValid ? selectedSize.basePrice : 0;
  const letteringPrice = isConfigurationValid ? letterCount * selectedSize.perCharacterPrice : 0;
  const signSubtotal = baseSignPrice + letteringPrice;
  const waterproofPrice =
    waterproofEnabled && isConfigurationValid ? Math.max(490, roundToNearestTen(signSubtotal * 0.18)) : 0;
  const dimmerPrice = effectiveDimmerEnabled && isConfigurationValid ? 210 : 0;
  const nfcPrice = nfcEnabled && isConfigurationValid ? 499 : 0;
  const calculatedPrice = signSubtotal + waterproofPrice + dimmerPrice + nfcPrice;
  const addOnCount = [effectiveDimmerEnabled, waterproofEnabled, nfcEnabled].filter(Boolean).length;
  const selectedColorOptions = resolvedWordColorIds.map((colorId) => getNeonColorOption(colorId));
  const previewLinesWithColors = previewWordMatrix.map((lineWords, lineIndex) => {
    const colorOffset = previewWordMatrix
      .slice(0, lineIndex)
      .reduce((total, currentLine) => total + currentLine.length, 0);

    return lineWords.map((word, wordIndex) => {
      const colorId = resolvedWordColorIds[colorOffset + wordIndex] ?? neonColors[0].id;

      return {
        label: word,
        colorId,
      };
    });
  });
  const uniqueColorIds = Array.from(new Set(selectedColorOptions.map((color) => color.id)));
  const colorSummary =
    uniqueColorIds.length === 1 && !selectedColorOptions[0]?.isMulticolor
      ? selectedColorOptions[0]?.label ?? "Rojo"
      : "Multicolor personalizado";
  const selectedAddOnLabels = [
    effectiveDimmerEnabled ? "Control remoto Dimmer" : null,
    waterproofEnabled ? "Waterproof exterior" : null,
    nfcEnabled ? "Tecnologia NFC" : null,
  ].filter((item): item is string => Boolean(item));
  const isMobileLayout = isMobileViewport === true;
  const isPreviewDraggable = isMobileViewport === false;
  const hasValidationError =
    hasLineCountError || hasLineLengthError || isBelowMinimumCharacters || !hasTypedText;
  const addToCartLabel = !hasTypedText || isBelowMinimumCharacters
    ? "Completa minimo 3 caracteres"
    : hasLineCountError || hasLineLengthError
      ? "Corrige la configuracion para continuar"
      : `Agregar al carrito - ${formatPrice(calculatedPrice)}`;
  const priceBreakdown = [
    { label: `Base ${selectedSize.width}`, value: baseSignPrice },
    { label: `Texto (${letterCount} letras)`, value: letteringPrice },
    { label: "Control remoto Dimmer", value: dimmerPrice },
    { label: "Waterproof exterior", value: waterproofPrice },
    { label: "Tecnologia NFC", value: nfcPrice },
  ];
  const validationMessage = hasLineCountError
    ? `Esta medida admite hasta ${selectedSize.maxLines} renglones.`
    : hasLineLengthError
      ? `El renglon ${firstOverflowLineIndex + 1} supera el maximo de ${selectedSize.maxLettersPerLine} letras para esta medida.`
      : isBelowMinimumCharacters
        ? "Se requieren 3 o mas caracteres para este tamano. Agrega mas texto para continuar."
        : !hasTypedText
          ? "Escribe tu texto y el simulador cotizara en tiempo real."
          : isPreviewDraggable
            ? "El texto se ajusta al ambiente y puedes moverlo dentro de la zona de montaje."
            : "En movil el preview se centra automaticamente para priorizar lectura, scroll y compra.";
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const repeatedMarquee = [...marqueeImages, ...marqueeImages];
  const selectedEnvironment =
    environmentOptions.find((environment) => environment.id === selectedEnvironmentId) ??
    environmentOptions[0];
  const marqueeCards = repeatedMarquee;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleViewportChange = (event?: MediaQueryListEvent) => {
      const nextIsMobileViewport = event ? event.matches : mediaQuery.matches;

      setIsMobileViewport(nextIsMobileViewport);

      if (!nextIsMobileViewport) {
        setMobileMenuOpen(false);
      }
    };

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileMenuOpen]);

  useEffect(() => {
    if (isMobileLayout) {
      animate(previewX, 0, { duration: 0.2 });
      animate(previewY, 0, { duration: 0.2 });
    }
  }, [isMobileLayout, previewX, previewY]);

  useEffect(() => {
    const nextDelta = calculatedPrice - previousPriceRef.current;

    if (hasAnimatedPriceRef.current) {
      setPriceDelta(nextDelta);
    }

    previousPriceRef.current = calculatedPrice;
    hasAnimatedPriceRef.current = true;
  }, [calculatedPrice]);

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
    const existingItem = cartItems.find((item) => item.id === itemId);

    if (existingItem) {
      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      setCartItems((currentItems) => [
        ...currentItems,
        {
          id: itemId,
          phrase: normalizedPhrase,
          fontName: selectedFont.label,
          sizeLabel: `${selectedSize.width} / aprox. ${selectedSize.height}`,
          lineCount: currentLineCount,
          colorLabel: colorSummary,
          addOns: selectedAddOnLabels,
          price: calculatedPrice,
          qty: 1,
        },
      ]);
    }

    setCartOpen(true);
  }

  function incrementItem(id: string) {
    setCartItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
    );
  }

  function decrementItem(id: string) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0),
    );
  }

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

  function handlePhraseChange(value: string) {
    setPhrase(sanitizePhraseInput(value));
  }

  function scrollToSection(sectionId: string) {
    setMobileMenuOpen(false);

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const stickyOffset = isMobileLayout ? 116 : 132;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - stickyOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }

  function openCart() {
    setMobileMenuOpen(false);
    setCartOpen(true);
  }

  function handleProductDetail(productName: string) {
    if (!hasTypedText) {
      setPhrase(sanitizePhraseInput(productName));
    }

    scrollToSection("configurador");
  }

  function updateActiveWordColor(colorId: string) {
    setWordColorIds((currentColors) => {
      const nextColors = [...currentColors];
      nextColors[safeActiveWordIndex] = colorId;
      return nextColors;
    });
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      <div className="sticky top-0 z-50">
        <AnnouncementBar isMobileLayout={isMobileLayout} items={announcementItems} />
        <SiteHeader
          cartCount={cartCount}
          categories={categories}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          onOpenCart={openCart}
          onScrollToSection={scrollToSection}
          onToggleMobileMenu={() => setMobileMenuOpen((currentOpen) => !currentOpen)}
        />
      </div>

      <HeroSection heroInstallationStyle={heroInstallationStyle} />

      <ConfiguratorPreviewSection promoBannerStyle={promoBannerStyle} />

      <Configurator
        activeColorId={activeColorId}
        activeWordLabel={activeWordLabel}
        addOnCount={addOnCount}
        addToCartLabel={addToCartLabel}
        calculatedPrice={calculatedPrice}
        currentLineCount={currentLineCount}
        dimmerAvailable={dimmerAvailable}
        editableWordTokens={editableWordTokens}
        effectiveDimmerEnabled={effectiveDimmerEnabled}
        environmentOptions={environmentOptions}
        fontOptions={fontOptions}
        hasValidationError={hasValidationError}
        isConfigurationValid={isConfigurationValid}
        isMobileLayout={isMobileLayout}
        isPreviewDraggable={isPreviewDraggable}
        letterCount={letterCount}
        neonColors={neonColors}
        nfcEnabled={nfcEnabled}
        normalizedPhrase={normalizedPhrase}
        onAddToCart={addToCart}
        onDimmerChange={setDimmerEnabled}
        onNfcChange={setNfcEnabled}
        onPhraseChange={handlePhraseChange}
        onResetPreview={resetPreview}
        onSelectActiveWord={setActiveWordIndex}
        onSelectEnvironment={setSelectedEnvironmentId}
        onSelectFont={setSelectedFont}
        onSelectSize={setSelectedSize}
        onUpdateActiveWordColor={updateActiveWordColor}
        onWaterproofChange={setWaterproofEnabled}
        onZoomPreview={zoomPreview}
        phrase={phrase}
        previewBoundsRef={previewBoundsRef}
        previewLinesWithColors={previewLinesWithColors}
        previewScale={previewScale}
        previewSignMaxWidth={previewSignMaxWidth}
        previewX={previewX}
        previewY={previewY}
        priceBreakdown={priceBreakdown}
        priceDelta={priceDelta}
        resolvedWordColorIds={resolvedWordColorIds}
        safeActiveWordIndex={safeActiveWordIndex}
        selectedAddOnLabels={selectedAddOnLabels}
        selectedEnvironment={selectedEnvironment}
        selectedEnvironmentId={selectedEnvironmentId}
        selectedFont={selectedFont}
        selectedSize={selectedSize}
        sizeOptions={sizeOptions}
        validationMessage={validationMessage}
        waterproofEnabled={waterproofEnabled}
      />

      <CasesSection anatomyDetailStyle={anatomyDetailStyle} />

      <GallerySection isMobileLayout={isMobileLayout} marqueeCards={marqueeCards} />

      <ProductLinesSection
        formatPrice={formatPrice}
        onProductDetail={handleProductDetail}
        products={suggestedProducts}
      />

      <TestimonialsSection reviews={reviewCards} />

      <SiteFooter categories={categories} paymentMethods={paymentMethods} />

      <CartDrawer
        items={cartItems}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
      />
    </main>
  );
}
