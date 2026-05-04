import type { CSSProperties } from "react";
import type { PaymentMethod } from "@/components/layout/site-footer";

export type ProductCard = {
  name: string;
  category: string;
  price: number;
  image: string;
  slug: string;
};

export type ReviewCard = {
  name: string;
  city: string;
  quote: string;
  image: string;
  heightClassName: string;
};

export const announcementItems = [
  "Envio GRATIS en pedidos mayores a $1,999 MXN",
  "Instalacion sencilla y asesoria directa",
  "Personaliza tu frase y visualizala al momento",
  "Produccion en Neon, Acrilico y MDF",
];

export const categories = ["Letreros Neon", "Frases LED", "Corte Laser", "Acrilico 3D", "Empresas"];

export const marqueeImages = [
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

export const suggestedProducts: ProductCard[] = [
  {
    name: "The Sarmiento's",
    category: "Neon para eventos",
    price: 6450,
    slug: "the-sarmientos",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Coffee Corner",
    category: "Negocio / cafeteria",
    price: 4890,
    slug: "coffee-corner",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Mon Amour",
    category: "Decoracion interior",
    price: 5320,
    slug: "mon-amour",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Open Late",
    category: "Bar / restaurante",
    price: 5980,
    slug: "open-late",
    image:
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?q=80&w=1200&auto=format&fit=crop",
  },
];

export const reviewCards: ReviewCard[] = [
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

export const heroInstallationStyle = {
  backgroundImage: "url('/monceri-hero-installation.jpg')",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
} satisfies CSSProperties;

export const anatomyDetailStyle = {
  backgroundImage: "url('/monceri-anatomy-detail.jpg')",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
} satisfies CSSProperties;

export const promoBannerStyle = {
  background:
    "linear-gradient(135deg, #0B0F14 0%, #111827 50%, #4A0B13 100%)",
} satisfies CSSProperties;

export const paymentMethods: PaymentMethod[] = [
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
