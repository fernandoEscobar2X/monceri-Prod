import type {
  ConfiguratorAddon,
  ConfiguratorPriceBreakdown,
  ConfiguratorSize,
} from "../schemas/configurator";

export const CONFIGURATOR_PRODUCT_SLUG = "letrero-neon-personalizado";

export const CONFIGURATOR_SIZES = [
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
  },
] satisfies ConfiguratorSize[];

export function countConfiguratorLetters(value: string) {
  return value.replace(/\s+/g, "").length;
}

export function roundToNearestTen(value: number) {
  return Math.round(value / 10) * 10;
}

export function getConfiguratorSize(sizeId: string) {
  return CONFIGURATOR_SIZES.find((size) => size.id === sizeId) ?? null;
}

export function calculateNeonPrice(args: {
  addons: ConfiguratorAddon[];
  phrase: string;
  size: ConfiguratorSize;
}): ConfiguratorPriceBreakdown {
  const letterCount = countConfiguratorLetters(args.phrase);
  const base = args.size.basePrice;
  const lettering = letterCount * args.size.perCharacterPrice;
  const signSubtotal = base + lettering;
  const dimmer = args.addons.includes("dimmer") ? 210 : 0;
  const waterproof = args.addons.includes("waterproof")
    ? Math.max(490, roundToNearestTen(signSubtotal * 0.18))
    : 0;
  const nfc = args.addons.includes("nfc") ? 499 : 0;

  return {
    base,
    lettering,
    dimmer,
    waterproof,
    nfc,
    total: base + lettering + dimmer + waterproof + nfc,
  };
}
