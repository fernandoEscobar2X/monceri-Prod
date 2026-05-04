import type {
  ConfiguratorAddon,
  ConfiguratorPriceBreakdown,
  ConfiguratorSize,
} from "../schemas/configurator";

export const CONFIGURATOR_PRODUCT_SLUG = "letrero-neon-personalizado";

export const CONFIGURATOR_SIZES = [
  {
    id: "45cm",
    label: "45cm",
    width: "45cm",
    widthCm: 45,
    height: "35cm",
    maxLettersPerLine: 5,
    maxLines: 2,
    basePrice: 1300,
    perCharacterPrice: 0,
  },
  {
    id: "65cm",
    label: "65cm",
    width: "65cm",
    widthCm: 65,
    height: "35cm",
    maxLettersPerLine: 8,
    maxLines: 2,
    basePrice: 1500,
    perCharacterPrice: 0,
  },
  {
    id: "85cm",
    label: "85cm",
    width: "85cm",
    widthCm: 85,
    height: "35cm",
    maxLettersPerLine: 10,
    maxLines: 2,
    basePrice: 2100,
    perCharacterPrice: 0,
  },
  {
    id: "105cm",
    label: "105cm",
    width: "105cm",
    widthCm: 105,
    height: "35cm",
    maxLettersPerLine: 13,
    maxLines: 2,
    basePrice: 2300,
    perCharacterPrice: 0,
  },
  {
    id: "125cm",
    label: "125cm",
    width: "125cm",
    widthCm: 125,
    height: "35cm",
    maxLettersPerLine: 16,
    maxLines: 2,
    basePrice: 2570,
    perCharacterPrice: 0,
  },
  {
    id: "155cm",
    label: "155cm",
    width: "155cm",
    widthCm: 155,
    height: "35cm",
    maxLettersPerLine: 20,
    maxLines: 2,
    basePrice: 3200,
    perCharacterPrice: 0,
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
  const base = args.size.basePrice;
  // Business pricing includes text up to each size limit; validation enforces the hard cap.
  const lettering = 0;
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
