"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import {
  ArrowRight,
  Check,
  Menu,
  MessageCircle,
  Minus,
  Move,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Type,
  X,
} from "lucide-react";
import { CartDrawer, type CartItem } from "@/components/cart-drawer";

const NeonShowroomCanvas = dynamic(() => import("@/components/neon-showroom-canvas"), {
  ssr: false,
});

type FontOption = {
  id: string;
  label: string;
  previewFamily: string;
  previewClassName: string;
  fitBias: number;
};

type SizeOption = {
  id: string;
  label: string;
  width: string;
  widthCm: number;
  height: string;
  maxLettersPerLine: number;
  maxLines: number;
  basePrice: number;
  perCharacterPrice: number;
  previewMaxWidth: string;
  singleLineClassName: string;
  multiLineClassName: string;
};

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

type EnvironmentOption = {
  id: string;
  label: string;
  helper: string;
  style: {
    backgroundImage: string;
    backgroundPosition: string;
    backgroundRepeat: string;
    backgroundSize: string;
  };
};

type PaymentMethod = {
  id: string;
  label: string;
  src: string;
  slotWidth: number;
  slotHeight: number;
  badgeClassName: string;
};

type NeonColor = {
  id: string;
  label: string;
  hex: string;
  swatchBackground: string;
  isMulticolor?: boolean;
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

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function getNeonColorOption(colorId: string) {
  return neonColors.find((color) => color.id === colorId) ?? neonColors[0];
}

type AnimatedPriceCounterProps = {
  value: number;
  className?: string;
  durationMs?: number;
};

function AnimatedPriceCounter({
  value,
  className,
  durationMs = 180,
}: AnimatedPriceCounterProps) {
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const currentValueRef = useRef(value);

  useEffect(() => {
    const element = counterRef.current;

    if (!element) {
      return;
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    const startValue = currentValueRef.current;
    const targetValue = value;

    if (startValue === targetValue) {
      element.textContent = formatPrice(targetValue);
      return;
    }

    const delta = targetValue - startValue;
    const effectiveDuration = Math.min(260, Math.max(120, durationMs + Math.abs(delta) * 0.03));
    const startTime = performance.now();

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / effectiveDuration, 1);
      const nextValue = startValue + delta * progress;

      currentValueRef.current = nextValue;
      element.textContent = formatPrice(Math.round(nextValue));

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      currentValueRef.current = targetValue;
      element.textContent = formatPrice(targetValue);
      frameRef.current = null;
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [durationMs, value]);

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

function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  return (
    <li>
      <div
        className={`group inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/18 bg-white/92 px-4 py-3 shadow-[0_14px_34px_rgba(17,24,39,0.18)] transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-white/28 hover:bg-white ${method.badgeClassName}`}
      >
        <span className="sr-only">{method.label}</span>
        <span
          aria-hidden
          className="relative block shrink-0"
          style={{ width: method.slotWidth, height: method.slotHeight }}
        >
          <Image
            src={method.src}
            alt=""
            fill
            aria-hidden
            sizes={`${method.slotWidth}px`}
            className="object-contain opacity-100 grayscale-0 brightness-100 contrast-100 transition-[opacity,filter,transform] duration-200 md:opacity-90 md:grayscale md:brightness-[0.42] md:contrast-[1.2] md:group-hover:scale-[1.02] md:group-hover:opacity-100 md:group-hover:grayscale-0 md:group-hover:brightness-100 md:group-hover:contrast-100"
          />
        </span>
      </div>
    </li>
  );
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
  const repeatedAnnouncement = [...announcementItems, ...announcementItems];
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
    <main className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      <div className="sticky top-0 z-50">
        <div className="overflow-hidden bg-[#E63946] py-3 text-white">
          <motion.div
            className="flex w-max items-center gap-8 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: isMobileLayout ? 22 : 24,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {repeatedAnnouncement.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-8 px-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] sm:text-sm sm:tracking-[0.26em]">
                  {item}
                </span>
                <span className="size-1.5 rounded-full bg-white/60" />
              </div>
            ))}
          </motion.div>
        </div>

        <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
                aria-controls="mobile-site-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((currentOpen) => !currentOpen)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-300 lg:hidden"
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              <a href="#inicio" className="font-display text-2xl font-black tracking-tight text-[#111827]">
                M<span className="text-[#E63946]">O</span>NCERI
              </a>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-semibold text-gray-600 lg:flex">
              {categories.map((category) => (
                <a key={category} href="#catalogo" className="transition hover:text-[#111827]">
                  {category}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Buscar"
                onClick={() => scrollToSection("catalogo")}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-[#111827]"
              >
                <Search className="size-4.5" />
              </button>
              <button
                type="button"
                aria-label="Contacto"
                onClick={() => scrollToSection("contacto")}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-[#111827]"
              >
                <MessageCircle className="size-4.5" />
              </button>
              <button
                type="button"
                onClick={openCart}
                aria-label="Abrir carrito"
                className="relative inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-[#111827]"
              >
                <ShoppingCart className="size-4.5" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-[#E63946] text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Cerrar menu"
                className="fixed inset-0 z-40 bg-[#111827]/45 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                id="mobile-site-menu"
                className="absolute inset-x-0 top-full z-50 border-b border-gray-200 bg-white px-4 pb-5 pt-4 shadow-[0_24px_48px_rgba(17,24,39,0.12)] lg:hidden"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection("configurador")}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white"
                    >
                      Cotizar
                    </button>
                    <button
                      type="button"
                      onClick={openCart}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111827]"
                    >
                      Carrito {cartCount > 0 ? `(${cartCount})` : ""}
                    </button>
                  </div>

                  <nav className="grid gap-2 text-left">
                    {[
                      { id: "inicio", label: "Inicio" },
                      { id: "configurador", label: "Configurador" },
                      { id: "catalogo", label: "Catalogo" },
                      { id: "contacto", label: "Contacto" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3 text-sm font-semibold text-[#111827]"
                      >
                        {item.label}
                        <ArrowRight className="size-4 text-[#E63946]" />
                      </button>
                    ))}
                  </nav>

                  <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-4 text-left">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E63946]">
                      Atencion directa
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#111827]">hola@monceri.mx</p>
                    <p className="mt-1 text-sm text-gray-500">Xalapa, Veracruz</p>
                  </div>
                </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>
      </div>

      <section id="inicio" className="bg-white">
        <div className="grid lg:min-h-[620px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] xl:min-h-[680px]">
          <div className="px-4 py-10 sm:px-6 lg:py-16 lg:pl-[max(2rem,calc((100vw-1440px)/2+2rem))] lg:pr-10 xl:pr-14">
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-[#E63946]">
                <Sparkles className="size-4" />
                Monceri corte laser shop
              </div>

              <h1 className="font-display mt-6 text-balance text-4xl font-black tracking-tight text-[#111827] sm:text-6xl xl:text-7xl">
                Fabricamos tus ideas en Neon, Acrilico y MDF.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                Letreros personalizados, piezas en acrilico, corte laser y volumen para negocios,
                eventos y espacios que necesitan verse mejor desde el primer vistazo.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#configurador" className="hard-button w-full sm:w-auto">
                  Cotiza tu letrero Neon
                  <ArrowRight className="size-5" />
                </a>
                <a href="#catalogo" className="hard-button hard-button-light w-full sm:w-auto">
                  Ver productos destacados
                </a>
              </div>

              <div className="mt-10 grid gap-6 border-t border-gray-200 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#111827]">
                    +5,000
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">Frases convertidas en letreros.</p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#111827]">
                    4.9 / 5
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">Calificacion promedio en clientes.</p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#111827]">
                    Hecho en MX
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">Produccion local y atencion directa.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden bg-[#0B0F14] sm:min-h-[430px] lg:min-h-full">
            <div className="absolute inset-0" style={heroInstallationStyle} />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,12,0.48)_0%,rgba(6,8,12,0.14)_42%,rgba(6,8,12,0.4)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0)_34%,rgba(0,0,0,0.34)_100%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-8 lg:p-10 xl:p-12">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
                <ShieldCheck className="size-4 text-[#E63946]" />
                Instalacion real Monceri
              </div>

              <div className="max-w-[340px] text-left sm:max-w-md">
                <div className="border border-white/12 bg-black/38 p-4 backdrop-blur-[2px] sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                    Resultado comercial real
                  </p>
                  <p className="mt-3 text-xl font-semibold leading-tight text-white sm:text-2xl">
                    Letreros y piezas que ya viven en negocios, eventos y espacios fotografiables.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/74">
                    La idea no es prometer un mockup bonito, sino mostrar el tipo de presencia visual
                    que Monceri ya entrega en instalaciones reales.
                  </p>
                </div>
              </div>

              <div
                className="no-scrollbar -mb-1 flex gap-3 overflow-x-auto pb-1 pr-4 snap-x snap-mandatory sm:mb-0 sm:grid sm:max-w-xl sm:grid-cols-3 sm:overflow-visible sm:pb-0 sm:pr-0"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {[
                  "Negocios y locales",
                  "Eventos especiales",
                  "Decoracion interior",
                ].map((item) => (
                  <div
                    key={item}
                    className="min-w-[190px] snap-start border border-white/12 bg-black/24 px-4 py-4 text-left text-sm font-medium text-white backdrop-blur-[2px] sm:min-w-0"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={promoBannerStyle} className="border-b border-white/10 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-3xl text-left">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/75">
              Frase Neon personalizable
            </p>
            <h2 className="font-display mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Disena tu frase, visualizala y llevala directo al carrito.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78">
              Un flujo pensado para convertir visitas en pedidos reales, con visualizacion en ambiente
              y precio estimado en tiempo real.
            </p>
          </div>

          <div
            className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {[
              { title: "Garantia", subtitle: "Fabricacion cubierta" },
              { title: "Instalacion", subtitle: "Guiada y sencilla" },
              { title: "Atencion", subtitle: "WhatsApp directo" },
            ].map((badge) => (
              <div
                key={badge.title}
                className="flex h-28 w-28 shrink-0 snap-start flex-col items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-center backdrop-blur-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">{badge.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/75">{badge.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="configurador" className="border-b border-gray-200 bg-white">
        <div className="grid lg:items-start lg:grid-cols-[1.08fr_0.92fr]">
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
                        setSelectedEnvironmentId(environment.id);
                        resetPreview();
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
                    onClick={() => zoomPreview("out")}
                    className="inline-flex size-10 items-center justify-center border border-white/12 bg-black/24 text-white transition hover:border-white/28"
                    aria-label="Alejar preview"
                  >
                    <Minus className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={resetPreview}
                    className="inline-flex h-10 items-center justify-center gap-2 border border-white/12 bg-black/24 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white/28"
                  >
                    <RefreshCw className="size-4" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => zoomPreview("in")}
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

          <div className="bg-white">
            <div className="mx-auto flex h-full w-full max-w-[640px] flex-col px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
                Configurador principal
              </p>
              <h2 className="font-display mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
                Crea tu Letrero Neon con los siguientes pasos
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                Escribe tu texto, define medida, tipografia, color y extras. El precio se actualiza
                automaticamente mientras configuras.
              </p>

              <div className="mt-10 space-y-6 text-left">
                <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <label
                        htmlFor="phrase"
                        className="block text-sm font-bold uppercase tracking-[0.2em] text-gray-500"
                      >
                        Escribe tu texto
                      </label>
                      <p className="mt-2 text-sm text-gray-500">
                        {currentLineCount}/3 Renglones, {selectedSize.maxLettersPerLine} Letras maximas por renglon
                      </p>
                    </div>

                    <div className="rounded-full bg-[#111827] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                      {letterCount} caracteres
                    </div>
                  </div>

                  <textarea
                    id="phrase"
                    value={phrase}
                    onChange={(event) => handlePhraseChange(event.target.value)}
                    rows={3}
                    className="mt-4 w-full rounded-[24px] border border-gray-200 bg-white px-4 py-4 text-2xl font-black tracking-tight text-[#111827] outline-none transition focus:border-[#E63946] sm:px-5 sm:text-3xl"
                    placeholder="Monceri"
                  />

                  <div
                    className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                      hasValidationError
                        ? "border-[#E63946]/20 bg-[#FFF1F3] text-[#B42318]"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    {validationMessage}
                  </div>
                </div>

                <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                        Elige el tamano de tu letrero
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Las medidas mostradas pueden variar de 2 a 4 centimetros.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                      <Ruler className="size-4" />
                      Medida estimada
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {sizeOptions.map((size) => {
                      const isActive = selectedSize.id === size.id;

                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-[24px] border px-4 py-4 text-left transition ${
                            isActive
                              ? "border-[#E63946] bg-white shadow-[0_18px_40px_rgba(230,57,70,0.08)]"
                              : "border-gray-200 bg-white hover:border-[#E63946]/25"
                          }`}
                        >
                          <div className="text-xl font-black tracking-tight text-[#111827]">{size.label}</div>
                          <div className="mt-2 text-sm leading-6 text-gray-500">
                            Maximo {size.maxLettersPerLine} letras y {size.maxLines} renglones
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                        Selecciona una tipografia
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        El grosor de la tira neon led es de 6mm.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                      <Type className="size-4" />
                      Vista real en el preview
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {fontOptions.map((font) => {
                      const isActive = selectedFont.id === font.id;

                      return (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => setSelectedFont(font)}
                          className={`flex min-h-[112px] items-center overflow-hidden rounded-[22px] border bg-white p-4 text-left transition ${
                            isActive
                              ? "border-[#E63946] shadow-[0_16px_36px_rgba(230,57,70,0.08)]"
                              : "border-gray-200 hover:border-[#E63946]/25"
                          }`}
                        >
                          <div
                            className={`text-balance max-w-full overflow-hidden text-[clamp(1.65rem,2.35vw,2.55rem)] leading-[0.92] [overflow-wrap:anywhere] ${font.previewClassName}`}
                            style={{ fontFamily: font.previewFamily }}
                          >
                            {font.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-xl">
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                        Selecciona el color del neon
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Puedes personalizar el color neon de cada palabra. Da click en la palabra
                        para cambiarla.
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                        Palabra activa
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[#E63946]">{activeWordLabel}</div>
                    </div>
                  </div>

                  <div
                    className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {editableWordTokens.map((word, index) => {
                      const isActive = safeActiveWordIndex === index;
                      const currentColor = getNeonColorOption(resolvedWordColorIds[index] ?? neonColors[0].id);

                      return (
                        <button
                          key={`${word}-${index}`}
                          type="button"
                          onClick={() => setActiveWordIndex(index)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            isActive
                              ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                              : "border-gray-200 bg-white text-gray-500 hover:border-[#E63946]/25"
                          }`}
                        >
                          <span>{word}</span>
                          <span
                            className="ml-2 inline-flex size-2.5 rounded-full align-middle"
                            style={{ background: currentColor.swatchBackground }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#111827]">
                    {getNeonColorOption(activeColorId).label}
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {neonColors.map((color) => {
                      const isActive = activeColorId === color.id;

                      return (
                        <button
                          key={color.id}
                          type="button"
                          aria-label={`Seleccionar ${color.label}`}
                          onClick={() => updateActiveWordColor(color.id)}
                          className={`relative aspect-square rounded-2xl border transition ${
                            isActive
                              ? "border-[#E63946] shadow-[0_12px_30px_rgba(230,57,70,0.16)]"
                              : "border-gray-200 hover:border-[#E63946]/25"
                          }`}
                          style={{ background: color.swatchBackground }}
                        >
                          {isActive ? (
                            <span className="absolute inset-0 flex items-center justify-center text-[#111827]">
                              <Check className="size-5" />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-gray-200 bg-white p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-xl">
                          <p className="text-lg font-bold tracking-tight text-[#111827]">
                            Control remoto Dimmer (+$210)
                          </p>
                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            Personaliza los efectos de luz, encendido y apagado, y la intensidad de
                            luz. Disponible unicamente en letreros de 70 cm o menos.
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#E63946]">Ejemplo</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          disabled={!dimmerAvailable}
                          onClick={() => setDimmerEnabled(true)}
                          className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                            effectiveDimmerEnabled
                              ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                              : "border-gray-200 bg-white text-[#111827]"
                          } ${!dimmerAvailable ? "cursor-not-allowed opacity-45" : "hover:border-[#E63946]/25"}`}
                        >
                          Si
                        </button>
                        <button
                          type="button"
                          onClick={() => setDimmerEnabled(false)}
                          className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                            !effectiveDimmerEnabled
                              ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                              : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                          }`}
                        >
                          No
                        </button>
                      </div>

                      {!dimmerAvailable ? (
                        <p className="mt-3 text-sm text-[#B42318]">
                          Esta medida ya no permite dimmer. Cambia a 50cm o 70cm para activarlo.
                        </p>
                      ) : null}
                    </div>

                    <div className="rounded-[24px] border border-gray-200 bg-white p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-xl">
                          <p className="text-lg font-bold tracking-tight text-[#111827]">
                            Waterproof - Letrero para exterior
                          </p>
                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            Agrega tecnologia Waterproof con certificacion IP65 para uso exterior y
                            ambientes humedos. El precio se estima segun el tamano elegido.
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#E63946]">Ejemplo</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setWaterproofEnabled(true)}
                          className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                            waterproofEnabled
                              ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                              : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                          }`}
                        >
                          Si
                        </button>
                        <button
                          type="button"
                          onClick={() => setWaterproofEnabled(false)}
                          className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                            !waterproofEnabled
                              ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                              : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-gray-200 bg-white p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-xl">
                          <p className="text-lg font-bold tracking-tight text-[#111827]">
                            Tecnologia NFC (+$499)
                          </p>
                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            Tus clientes podran interactuar con su smartphone y abrir tus redes,
                            sitio web o cualquier link personalizado.
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#E63946]">Ejemplo</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setNfcEnabled(true)}
                          className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                            nfcEnabled
                              ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                              : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                          }`}
                        >
                          Si
                        </button>
                        <button
                          type="button"
                          onClick={() => setNfcEnabled(false)}
                          className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                            !nfcEnabled
                              ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                              : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

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
                        <div>Base: {formatPrice(selectedSize.basePrice)}</div>
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

                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!isConfigurationValid}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#E63946] px-4 text-base font-bold text-white shadow-[0_18px_34px_rgba(230,57,70,0.24)] transition hover:-translate-y-0.5 hover:bg-[#c81f2f] disabled:cursor-not-allowed disabled:bg-[#F29AA3] disabled:shadow-none sm:h-16 sm:px-6 sm:text-lg"
                >
                  <ShoppingBag className="size-5" />
                  {addToCartLabel}
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Color por palabra con vista instantanea",
                    "Precio que reacciona en tiempo real",
                    "Dimmer, waterproof y NFC integrados",
                    "Checkout preparado para seguir creciendo",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-[22px] border border-gray-200 bg-[#FAFAFA] px-4 py-4"
                    >
                      <div className="inline-flex size-8 items-center justify-center rounded-full bg-[#E63946]/10 text-[#E63946]">
                        <Check className="size-4" />
                      </div>
                      <p className="text-sm font-medium text-[#111827]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#F4F5F7]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-18">
          <div className="relative min-h-[380px] overflow-hidden bg-[#120d0a] sm:min-h-[520px] lg:min-h-[620px]">
            <div className="absolute inset-0" style={anatomyDetailStyle} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.02)_36%,rgba(0,0,0,0.3)_100%)]" />

            <div className="relative z-10 h-full px-4 py-5 sm:px-8 sm:py-10">
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 bg-black/56 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm sm:left-8 sm:top-8">
                <Sparkles className="size-3.5 text-[#E63946]" />
                Pieza real Monceri
              </div>

              <div className="absolute left-3 top-[5.5rem] hidden max-w-[190px] bg-black/64 px-4 py-3 text-sm text-white backdrop-blur-sm sm:block sm:left-[10%] sm:top-[22%]">
                <p className="font-semibold">Trazo continuo</p>
                <p className="mt-1 text-xs text-white/70">Lectura limpia y brillo uniforme en toda la forma.</p>
              </div>
              <div className="absolute left-[29%] top-[30%] hidden h-px w-[82px] bg-white/32 lg:block" />

              <div className="absolute right-3 top-[58%] hidden max-w-[200px] bg-black/64 px-4 py-3 text-sm text-white backdrop-blur-sm sm:block sm:right-[8%] sm:top-[44%]">
                <p className="font-semibold">Base lista para montar</p>
                <p className="mt-1 text-xs text-white/70">Pensada para instalar con presencia y estabilidad visual.</p>
              </div>
              <div className="absolute right-[26%] top-[49%] hidden h-px w-[74px] bg-white/32 lg:block" />

              <div className="absolute left-3 bottom-4 hidden max-w-[210px] bg-black/64 px-4 py-3 text-sm text-white backdrop-blur-sm sm:block sm:left-[12%] sm:bottom-[14%]">
                <p className="font-semibold">Montaje limpio</p>
                <p className="mt-1 text-xs text-white/70">La construccion debe verse premium incluso a corta distancia.</p>
              </div>
              <div className="absolute left-[26%] bottom-[23%] hidden h-px w-[96px] bg-white/32 lg:block" />
            </div>
          </div>

          <div className="text-left">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
              Anatomia de un letrero
            </p>
            <h2 className="font-display mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
              Materiales y acabados que sostienen la venta.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
              La pieza final no solo debe verse bien en foto. Debe sentirse solida, instalarse con
              facilidad y mantenerse impecable en uso real.
            </p>

            <div className="mt-10 space-y-5">
              {[
                {
                  title: "Acrilico 6mm",
                  text: "Mayor estabilidad visual y una base premium para logos o frases luminosas.",
                },
                {
                  title: "Waterproof IP65",
                  text: "Listo para proyectos que exigen resistencia y confianza en condiciones reales.",
                },
                {
                  title: "Angulos y trazos limpios",
                  text: "La lectura importa. Por eso se cuidan curvas, cortes y remates de cada linea.",
                },
                {
                  title: "Instalacion guiada",
                  text: "El proyecto llega con claridad visual para que el montaje no se vuelva un dolor de cabeza.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 border-b border-gray-200 pb-5"
                >
                  <div className="mt-1 inline-flex size-10 items-center justify-center rounded-full bg-[#E63946]/10 text-[#E63946]">
                    <Check className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#111827]">{feature.title}</p>
                    <p className="mt-2 text-base leading-7 text-gray-600">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-black text-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.4fr_0.6fr] lg:px-8 lg:py-18">
          <div className="text-left">
            <div className="flex items-center gap-1 text-[#FF8FA3]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={`proof-star-${index}`} className="size-5 fill-current" />
              ))}
            </div>
            <h2 className="font-display mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Mas de 5,000 frases convertidas en letreros de Neon.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-white/72">
              El sitio debe vender confianza, inspiracion visual y evidencia real de que el resultado
              final se ve increible en negocio, sala, evento o showroom.
            </p>
          </div>

          <div className="overflow-hidden">
            <motion.div
              className="flex w-max gap-4 px-4 pb-2 sm:gap-5 sm:px-0 sm:pb-0"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: isMobileLayout ? 34 : 28,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              {marqueeCards.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="flex w-[240px] shrink-0 flex-col overflow-hidden border border-white/10 bg-white/5 sm:w-[280px]"
                >
                  <div
                    className="h-[280px] bg-cover bg-center sm:h-[340px]"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="border-t border-white/10 px-4 py-4 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      Cliente real
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="border-b border-gray-200 bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="flex flex-col gap-4 text-left lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
                Te puede interesar
              </p>
              <h2 className="font-display mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
                Productos predisenados con vibes de showroom.
              </h2>
            </div>
            <a href="#configurador" className="text-sm font-bold uppercase tracking-[0.2em] text-[#111827]">
              Ir al configurador
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500 sm:hidden">Desliza para ver mas productos.</p>

          <div
            className="no-scrollbar -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory sm:mx-0 sm:mt-10 sm:gap-5 sm:px-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {suggestedProducts.map((product) => (
              <article
                key={product.name}
                className="w-[84vw] max-w-[320px] shrink-0 snap-start overflow-hidden border border-gray-200 bg-white shadow-sm"
              >
                <div
                  className="h-[280px] bg-cover bg-center sm:h-[360px]"
                  style={{ backgroundImage: `url('${product.image}')` }}
                />
                <div className="px-5 py-5 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                    {product.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#111827]">
                    {product.name}
                  </h3>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-lg font-bold text-[#111827]">{formatPrice(product.price)}</span>
                    <button
                      type="button"
                      onClick={() => handleProductDetail(product.name)}
                      className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition-colors hover:bg-black"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-2xl text-left">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
              Clientes felices
            </p>
            <h2 className="font-display mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
              Fotos reales, espacios reales, resultados que si venden.
            </h2>
          </div>

          <div className="mt-10 columns-1 gap-6 md:columns-2 xl:columns-3">
            {reviewCards.map((review) => (
              <article key={`${review.name}-${review.city}`} className="mb-6 break-inside-avoid">
                <div
                  className={`${review.heightClassName} bg-cover bg-center`}
                  style={{ backgroundImage: `url('${review.image}')` }}
                />
                <div className="relative -mt-10 mx-5 border border-gray-200 bg-white px-5 py-5 shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-[#FF8FA3]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={`${review.name}-${index}`} className="size-4 fill-current" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1F3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#E63946]">
                      <Check className="size-3.5" />
                      Verified
                    </span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-gray-600">&ldquo;{review.quote}&rdquo;</p>
                  <div className="mt-5">
                    <p className="font-semibold text-[#111827]">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.city}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#E63946] text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-white/16 pb-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
            <div className="max-w-md text-left">
              <p className="font-display text-4xl font-black tracking-tight">Monceri</p>
              <p className="mt-4 text-base leading-7 text-white/82">
                Neon, acrilico, corte laser y piezas visuales con presencia comercial real.
              </p>
              <ul className="mt-6 flex flex-wrap gap-3 sm:gap-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodBadge key={method.id} method={method} />
                ))}
              </ul>
            </div>

            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">Categorias</p>
              <div className="mt-4 space-y-3 text-sm text-white/86">
                {categories.map((item) => (
                  <a key={item} href="#catalogo" className="block">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">Ayuda</p>
              <div className="mt-4 space-y-3 text-sm text-white/86">
                {["Preguntas frecuentes", "Envios", "Instalacion", "Politicas"].map((item) => (
                  <a key={item} href="#contacto" className="block">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div id="contacto" className="text-left">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">Contacto</p>
              <div className="mt-4 space-y-3 text-sm text-white/86">
                <p>hola@monceri.mx</p>
                <p>WhatsApp directo para cotizaciones</p>
                <p>Xalapa, Veracruz</p>
              </div>
              <a
                href="#configurador"
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-[#111827] px-5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(17,24,39,0.24)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_18px_34px_rgba(17,24,39,0.32)]"
              >
                <MessageCircle className="size-4" />
                Empezar cotizacion
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 text-sm text-white/72 lg:flex-row lg:items-center lg:justify-between">
            <p>VisibleMX x Monceri. Prototipo storefront v1.</p>
            <p>Checkout preparado para Mercado Pago, SPEI, tarjeta y OXXO.</p>
          </div>
        </div>
      </footer>

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
